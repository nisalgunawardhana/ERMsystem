const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

const sanitizeValue = (value) => {
    if (value === null || value === undefined) {
        return value;
    }
    const str = String(value);
    
    // Remove MongoDB operators at the start of strings
    if (str.startsWith('$')) {
        return str.substring(1);
    }

    // Enhanced dangerous patterns for MongoDB injection prevention
    const dangerousPatterns = [
        /\$where/gi,
        /\$regex/gi,
        /\$ne/gi,
        /\$gt/gi,
        /\$gte/gi,
        /\$lt/gi,
        /\$lte/gi,
        /\$in/gi,
        /\$nin/gi,
        /\$or/gi,
        /\$and/gi,
        /\$not/gi,
        /\$nor/gi,
        /\$exists/gi,
        /\$type/gi,
        /\$mod/gi,
        /\$all/gi,
        /\$size/gi,
        /\$elemMatch/gi,
        /\$slice/gi,
        /\$push/gi,
        /\$pull/gi,
        /\$pop/gi,
        /\$unset/gi,
        /\$set/gi,
        /\$inc/gi,
        /\$mul/gi,
        /\$rename/gi,
        /\$min/gi,
        /\$max/gi,
        /\$currentDate/gi,
        /javascript:/gi,
        /eval\(/gi,
        /function\(/gi,
        /ObjectId\(/gi
    ];

    // Check for dangerous patterns
    for (const pattern of dangerousPatterns) {
        if (pattern.test(str)) {
            // Return a safe version by removing the dangerous parts
            return str.replace(pattern, '');
        }
    }

    return value;
};


const sanitizeObject = (input) => {
    if (input === null || input === undefined) {
        return input;
    }

    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }

    if (typeof input === 'object') {
        const sanitized = {};
        
        for (const key in input) {
            if (input.hasOwnProperty(key)) {
                // Enhanced key sanitization - remove all $ operators
                const sanitizedKey = key.replace(/^\$+/, '');
                
                // Skip dangerous keys entirely
                const dangerousKeys = [
                    'where', 'mapReduce', 'group', 'eval', 'function',
                    '$where', '$mapReduce', '$group', '$eval', '$function',
                    'constructor', 'prototype', '__proto__'
                ];
                
                if (dangerousKeys.includes(sanitizedKey.toLowerCase()) || 
                    dangerousKeys.includes(key.toLowerCase())) {
                    continue;
                }
                
                // Recursively sanitize the value
                sanitized[sanitizedKey] = sanitizeInput(input[key]);
            }
        }
        
        return sanitized;
    }

    return sanitizeValue(input);
};

const sanitizeInput = (input) => {
    // First pass: Use express-mongo-sanitize
    let sanitized = mongoSanitize(input);
    
    // Second pass: Apply custom sanitization
    if (typeof sanitized === 'object' && sanitized !== null) {
        sanitized = sanitizeObject(sanitized);
    } else {
        sanitized = sanitizeValue(sanitized);
    }
    
    return sanitized;
};


const sanitizeReqBody = (reqBody) => {
    if (!reqBody || typeof reqBody !== 'object') {
        return {};
    }
    
    // Apply mongo-sanitize first, then custom sanitization
    let sanitized = mongoSanitize(reqBody);
    return sanitizeInput(sanitized);
};


const sanitizeQueryParams = (queryParams) => {
    if (!queryParams || typeof queryParams !== 'object') {
        return {};
    }
    
    // Apply mongo-sanitize first, then custom sanitization
    let sanitized = mongoSanitize(queryParams);
    return sanitizeInput(sanitized);
};


const sanitizeParams = (params) => {
    if (!params || typeof params !== 'object') {
        return {};
    }
    
    const sanitized = {};
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            // Apply both mongo-sanitize and custom sanitization to params
            const mongoSanitized = mongoSanitize(params[key]);
            sanitized[key] = sanitizeValue(mongoSanitized);
        }
    }
    
    return sanitized;
};


const sanitizeObjectId = (id) => {
    if (!id) return null;
    
    // First sanitize the input
    const sanitizedId = sanitizeValue(mongoSanitize(id));
    
    // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sanitizedId)) {
        return null;
    }
    
    // Additional check to ensure it's a proper 24-character hex string
    if (!/^[0-9a-fA-F]{24}$/.test(sanitizedId)) {
        return null;
    }
    
    return sanitizedId;
};

const sanitizeMiddleware = (req, res, next) => {
    try {
        // Apply express-mongo-sanitize middleware first
        mongoSanitize({
            replaceWith: '_',
            onSanitize: ({ req, key }) => {
                console.warn(`MongoDB injection attempt detected and sanitized: ${key}`);
            }
        })(req, res, () => {
            // Then apply custom sanitization
            try {
                // Sanitize request body
                if (req.body) {
                    req.body = sanitizeReqBody(req.body);
                }
                
                // Sanitize query parameters
                if (req.query) {
                    req.query = sanitizeQueryParams(req.query);
                }
                
                // Sanitize URL parameters
                if (req.params) {
                    req.params = sanitizeParams(req.params);
                }
                
                next();
            } catch (error) {
                console.error('Error in custom input sanitization:', error);
                res.status(400).json({ 
                    error: 'Invalid input data',
                    message: 'Request contains potentially harmful data'
                });
            }
        });
    } catch (error) {
        console.error('Error in input sanitization middleware:', error);
        res.status(400).json({ 
            error: 'Invalid input data',
            message: 'Request contains potentially harmful data'
        });
    }
};


const strictSanitize = (input) => {
    // Remove all MongoDB operators completely
    let sanitized = JSON.stringify(input);
    sanitized = sanitized.replace(/"\$[^"]*":/g, '"":');
    try {
        sanitized = JSON.parse(sanitized);
    } catch (e) {
        return {};
    }
    
    return sanitizeInput(sanitized);
};

module.exports = {
    sanitizeInput,
    sanitizeReqBody,
    sanitizeQueryParams,
    sanitizeParams,
    sanitizeObjectId,
    sanitizeValue,
    sanitizeMiddleware,
    strictSanitize
};
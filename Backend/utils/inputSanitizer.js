const mongoose = require('mongoose');

const sanitizeValue = (value) => {
    if (value === null || value === undefined) {
        return value;
    }
    const str = String(value);
    
    // Remove MongoDB operators at the start of strings
    if (str.startsWith('$')) {
        return str.substring(1);
    }

    // Remove dangerous JavaScript patterns
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
        /javascript:/gi,
        /eval\(/gi,
        /function\(/gi
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

/**
 * Recursively sanitizes an object or array
 * @param {any} input - The input to sanitize
 * @returns {any} - The sanitized input
 */
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
                // Sanitize the key name (remove $ operators)
                const sanitizedKey = key.startsWith('$') ? key.substring(1) : key;
                
                // Skip dangerous keys entirely
                if (sanitizedKey === 'where' || sanitizedKey === 'mapReduce' || sanitizedKey === 'group') {
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

/**
 * Main sanitization function that handles all input types
 * @param {any} input - The input to sanitize
 * @returns {any} - The sanitized input
 */
const sanitizeInput = (input) => {
    if (typeof input === 'object' && input !== null) {
        return sanitizeObject(input);
    }
    
    return sanitizeValue(input);
};

/**
 * Sanitizes request body data
 * @param {object} reqBody - The request body to sanitize
 * @returns {object} - The sanitized request body
 */
const sanitizeReqBody = (reqBody) => {
    if (!reqBody || typeof reqBody !== 'object') {
        return {};
    }
    
    return sanitizeInput(reqBody);
};

/**
 * Sanitizes query parameters
 * @param {object} queryParams - The query parameters to sanitize
 * @returns {object} - The sanitized query parameters
 */
const sanitizeQueryParams = (queryParams) => {
    if (!queryParams || typeof queryParams !== 'object') {
        return {};
    }
    
    return sanitizeInput(queryParams);
};

/**
 * Sanitizes URL parameters
 * @param {object} params - The URL parameters to sanitize
 * @returns {object} - The sanitized parameters
 */
const sanitizeParams = (params) => {
    if (!params || typeof params !== 'object') {
        return {};
    }
    
    const sanitized = {};
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            sanitized[key] = sanitizeValue(params[key]);
        }
    }
    
    return sanitized;
};

/**
 * Validates and sanitizes MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {string|null} - Valid ObjectId or null if invalid
 */
const sanitizeObjectId = (id) => {
    if (!id) return null;
    
    const sanitizedId = sanitizeValue(id);
    
    if (!mongoose.Types.ObjectId.isValid(sanitizedId)) {
        return null;
    }
    
    return sanitizedId;
};

/**
 * Express middleware for automatic input sanitization
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const sanitizeMiddleware = (req, res, next) => {
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
        console.error('Error in input sanitization middleware:', error);
        res.status(400).json({ 
            error: 'Invalid input data',
            message: 'Request contains potentially harmful data'
        });
    }
};

module.exports = {
    sanitizeInput,
    sanitizeReqBody,
    sanitizeQueryParams,
    sanitizeParams,
    sanitizeObjectId,
    sanitizeValue,
    sanitizeMiddleware
};
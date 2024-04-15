import React, { useState } from "react";
import './Layout.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux" ;
import { Popover, Space } from 'antd';

function Layout({children}) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Determine user's role based on boolean flags
    let userRole;

    if (user?.isAdmin) {
        userRole = 'admin';
    } else if (user?.isCashier) {
        userRole = 'cashier';
    } else if (user?.isFinanceManager) {
        userRole = 'financial manager';
    } else if (user?.isLogisticManager) {
        userRole = 'logistic manager';
    } else if (user?.isStaffManager) {
        userRole = 'staff manager';
    } else if (user?.isTrainingCoordinator) {
        userRole = 'training coordinator';
    } else {
        // Default to a role if none of the boolean flags are set
        userRole = 'default role';
    }

    //Menus of each user role
    //1. admin
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: 'ri-user-settings-line'
        },
        {
            name: 'Add User',
            path: '/signup',
            icon: 'ri-add-circle-line'
        },
        {
            name: 'Tasks',
            path: '/tasks',
            icon: 'ri-task-line'
        },
    ];

    //2. cashier
    const cashierMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: 'ri-user-settings-line'
        },
        {
            name: 'Billing',
            icon: 'ri-file-list-line',
            subMenu: [
                {
                    name: 'Create Bill',
                    path: '/createBill',
                    icon: 'ri-add-circle-line'
                }
            ]
        },
        {
            name: 'Customer',
            icon: 'ri-group-line',
            subMenu: [
                {
                    name: 'Add Customer',
                    path: '/addCustomer',
                    icon: 'ri-add-circle-line'
                }
            ]
        }
    ];
    
    //3. financial manager
    const financialManagerMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/finance',
            icon: 'ri-line-chart-line'
        },
        {
            name: 'Profit Log',
            path: '/signup',
            icon: 'ri-currency-line'
        },
        {
            name: 'Other Expenses',
            path: '/profile',
            icon: 'ri-coins-line'
        },
        {
            name: 'Tax Document',
            path: '/profile',
            icon: 'ri-article-line'
        },
    ];

    //4. logistic managers
    const logisticManagerMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: 'ri-user-settings-line'
        },
        {
            name: 'Stock',
            path: '/stock',
            icon: 'ri-archive-line',
        },
        {
            name: 'Supplier',
            path: '/supplier',
            icon: 'ri-truck-line', 
        }
    ];
    
    //5. staff manager
    const staffManagerMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: 'ri-user-settings-line'
        },
        {
            name: 'Add Employee',
            path: '/signup',
            icon: 'ri-add-circle-line'
        },
        {
            name: 'Attendance',
            path: '/attendance',
            icon: 'ri-check-double-line'
        },
        {
            name: 'Bonus Points',
            path: '/bonus-points',
            icon: 'ri-medal-line'
        },
        {
            name: 'Salaries',
            path: '/salaries',
            icon: 'ri-money-dollar-circle-line'
        }
    ];
    
    //6.training coordinator
    const trainingCoordinatorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: 'ri-user-settings-line'
        },
        {
            name: 'Add Trainee',
            path: '/signup',
            icon: 'ri-add-circle-line'
        },
        {
            name: 'Add Session',
            path: '/tasks',
            icon: 'ri-task-line'
        },
    ];

    //user
    const userMenu = [
        {
            name: 'Attendance',
            path: '/tasks',
            icon: 'ri-list-check-3'
        },
    ];

    // Define menu based on user's role
    let menuToBeRendered;

    switch (userRole) {
        case 'admin':
            menuToBeRendered = adminMenu;
            break;
        case 'cashier':
            menuToBeRendered = cashierMenu;
            break;
        case 'financial manager':
            menuToBeRendered = financialManagerMenu;
            break;
        case 'logistic manager':
            menuToBeRendered = logisticManagerMenu;
            break;
        case 'staff manager':
            menuToBeRendered = staffManagerMenu;
            break;
        case 'training coordinator':
            menuToBeRendered = trainingCoordinatorMenu;
            break;
        default:
            // Default to admin menu if the user's role is not recognized
            menuToBeRendered = userMenu;
            break;
    }

    const handleLogout = () => {
        // Show a confirmation message before logging out
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            navigate('/login');
        }
    };

    // Conditionally render children based on user role
    const renderChildren = () => {
        if (userRole === 'default role') {
            return null; // Return nothing if user role is default
        }
        return children; // Return children if user role is not default
    };

    //popover for the close icon
    const popoverContent = (
        <div> </div>
    );

    return (
        <div className="main p-2">
            <div className="d-flex layout"> 
                {/* sidebar */}
                <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                    <div className="sidebar-header">
                        <div className={`${collapsed ? 'collapsed-sidebar-shopname' : 'sidebar-shopname'}`}>
                            Diyana Fashion 
                        </div> 
                    </div>
                    <div className="menu">
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div 
                                    className={`d-flex menu-item ${
                                        isActive && "active-menu-item"}`}
                                    key={menu.name}
                                >
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                        <div 
                            className={`d-flex menu-item`} 
                            onClick={handleLogout}
                        >
                            <i className="ri-logout-circle-r-line"></i>
                            {!collapsed && <Link to='/login'>Logout</Link>}
                        </div>    
                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        {/*icon change from close button to menu icon*/}
                        {collapsed ? (
                            <Space wrap>
                            <Popover content={popoverContent} title="Expand Sidebar" trigger="hover" overlayClassName="open-popover">
                            <i 
                                className="ri-menu-line header-action-icon" 
                                onClick={() => setCollapsed(false)}
                            ></i>
                            </Popover>
                            </Space>
                        ) : (
                            <Space wrap>
                                <Popover content={popoverContent} title="Close Sidebar" trigger="hover" overlayClassName="close-popover">
                                 <i 
                                className="ri-close-line header-action-icon" 
                                onClick={() => setCollapsed(true)}
                            ></i>
                            </Popover>
                            </Space>
                           
                        )}
                        {/*name*/}
                        <div className="d-flex align-items-center px-5">
                            <Link className="anchor" to='/profile'>{user?.first_name} {user?.last_name}</Link>
                        </div>
                    </div>

                    {/*body*/}
                    <div className="body">
                    {renderChildren()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
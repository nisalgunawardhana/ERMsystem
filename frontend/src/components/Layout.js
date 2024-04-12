import React, { useState } from "react";
import './Layout.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux" 

function Layout({children}) {
    //collapased sidebar
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    console.log(user)
    const location = useLocation();
    const navigate = useNavigate();

    //sidebar menu
    //user -- actually admin
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
            name: 'Profile',
            path: '/profile',
            icon: 'ri-account-circle-line'
        },
    ];

    //financial Manager
    const financialManagerMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-4-line'
        },
        {
            name: 'Dashboard',
            path: '/Dashboard',
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

    const menuToBeRendered = user?.isAdmin ? adminMenu : financialManagerMenu;

    return (
        <div className="main p-2">
            <div className="d-flex layout"> 

                {/* sidebar */}
                <div className={`${collapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                    <div className="sidebar-header">
                        {/* shop name of the side menu*/}
                        <div className={`${collapsed ? 'collapsed-sidebar-shopname' : 'sidebar-shopname'}`}>
                            Diyana Fashion 
                        </div> 
                    </div>

                    {/* side menu */}
                    <div className="menu">
                        {menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;

                            return (
                                <div 
                                    className={`d-flex menu-item ${
                                        isActive && "active-menu-item"}`}>
                                    <i className={menu.icon}></i>
                                    {/*showing the link only if the sidebar is not collapsed*/}
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                        <div 
                            className={`d-flex menu-item`} onClick={() => {
                                localStorage.clear()
                                navigate('/login')
                            }}>
                                <i className="ri-logout-circle-r-line"></i>
                                {/*showing the link only if the sidebar is not collapsed*/}
                                {!collapsed && <Link to='/login'>Logout</Link>}
                        </div>    
                    </div>
                </div>
            
                <div className="content">
                    {/* header */}
                    <div className="header">
                    {/* Toggle collapsed state on clicking the close icon */} 
                        {collapsed ? (
                            <i 
                                className="ri-menu-line header-action-icon" 
                                onClick={() => setCollapsed(false)}></i>
                        ) : (
                            <i 
                                className="ri-close-line header-action-icon" 
                                onClick={() => setCollapsed(true)}>
                            </i>
                        )}

                        <div className="d-flex align-items-center px-5">
                            <Link className="anchor" to='/profile'>{user?.first_name}</Link>
                        </div>
                    </div>

                    {/* body */}
                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout;
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

export default function MainLayout() {

    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <Navbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div className="layout-body">

                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <main className="layout-content">
                    <Outlet />
                </main>

            </div>
        </>
    );
}
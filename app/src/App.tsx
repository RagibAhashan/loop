import { Layout } from "antd";
import React, { useState } from "react";
import SideBar from "./components/sidebar";
import * as Constants from "./constants";
import BillingPage from "./pages/billing";
import ProxyPage from "./pages/proxy";
import TaskPage from "./pages/Task/taskPage";

const { Content } = Layout;

const App = () => {
    const [page, setPage] = useState(Constants.MAIN);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <SideBar currentPage={page} setPage={setPage} />

            <Layout>
                <Content>
                    <div>
                        {page === Constants.MAIN ? <div> Welcome </div> : ""}
                        {page === Constants.BILLING ? (
                            <BillingPage setPage={setPage} />
                        ) : (
                            ""
                        )}
                        {page === Constants.PROXIES ? (
                            <ProxyPage setPage={setPage} />
                        ) : (
                            ""
                        )}
                        {page === Constants.TASKS ? <TaskPage /> : ""}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;

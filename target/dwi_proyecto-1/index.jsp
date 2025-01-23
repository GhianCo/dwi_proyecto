<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html
    lang="es"
    class="light-style layout-menu-fixed layout-compact"
    dir="ltr"
    data-theme="theme-default"
    data-assets-path="assets/"
    data-template="vertical-menu-template-free"
    data-style="light">

    <%@include file="head.jsp" %>

    <body>
        <!-- Layout wrapper -->
        <div class="layout-wrapper layout-content-navbar">
            <div class="layout-container">
                <!-- Menu -->
                <%@include file="menu.jsp" %>
                <!-- / Menu -->
                <!-- Layout container -->
                <div class="layout-page">
                    <!-- Navbar -->
                    <%@include file="navbar.jsp" %>
                    <!-- / Navbar -->
                    <!-- Content wrapper -->
                    <div class="content-wrapper">
                        <!-- Content -->
                        <div class="container-xxl flex-grow-1 container-p-y">
                            <div class="row gy-6">
                                <div class="col-md-12 col-lg-4">
                                    <div class="card">
                                        <div class="card-body text-nowrap">
                                            <h5 class="card-title mb-0 flex-wrap text-nowrap">Pagina principal! 🎉</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- / Content -->
                        <div class="content-backdrop fade"></div>
                    </div>
                    <!-- Content wrapper -->
                </div>
                <!-- / Layout page -->
            </div>
            <!-- Overlay -->
            <div class="layout-overlay layout-menu-toggle"></div>
        </div>
        <!-- / Layout wrapper -->
        <%@include file="scripts.jsp" %>
    </body>
</html>

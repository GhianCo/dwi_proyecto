<%@page import="org.json.JSONObject"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="shared.PaginationResult"%>
<%@page import="modules.conductor.services.impl.ConductorServiceImpl"%>
<%@page import="modules.conductor.models.Conductor"%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
    <%
        ConductorServiceImpl conductorservice = new ConductorServiceImpl();
        PaginationResult data = conductorservice.paginate("", 1, 20);
        ArrayList<Conductor> conductors = (ArrayList<Conductor>) data.getData();
    %>

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
                            <div class="mb-1 pb-2 d-flex justify-content-between pt-2 align-items-center">
                                <h5>Gestion de conductores</h5>
                                <div class="float-end">
                                    <button class="btn btn-primary d-grid w-100" data-bs-toggle="modal"
                                            onclick="registrarNuevoConductors()">Nuevo</button>
                                    <div class="modal fade" id="modalFormConductor" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <form id="nuevoConductorForm" onsubmit="guardarConductor(event)">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="modalFormConductorTitle">Nuevo conductor</h5>
                                                        <button
                                                            type="button"
                                                            class="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="persona_id"
                                                        hidden
                                                        name="persona_id"/>
                                                    <div class="modal-body">
                                                        <div class="row g-4">
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="nombres"
                                                                        name="nombres"
                                                                        class="form-control"
                                                                        placeholder="Ingresa los nombres" 
                                                                        required/>
                                                                    <label for="nombresWithTitle">Nombres</label>
                                                                </div>
                                                            </div>
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="apellidos"
                                                                        name="apellidos"
                                                                        class="form-control"
                                                                        placeholder="Ingresa los apellidos" 
                                                                        required/>
                                                                    <label for="apellidosWithTitle">Apellidos</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row g-4">
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="numero_documento"
                                                                        name="numero_documento"
                                                                        class="form-control"
                                                                        placeholder="Ingresa los DNI" 
                                                                        required/>
                                                                    <label for="dniWithTitle">DNI</label>
                                                                </div>
                                                            </div>
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="telefono"
                                                                        name="telefono"
                                                                        class="form-control"
                                                                        placeholder="Ingresa el telefono" 
                                                                        required/>
                                                                    <label for="telefonoWithTitle">Telefono</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row g-4">
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="email"
                                                                        name="email"
                                                                        class="form-control"
                                                                        placeholder="Ingresa el correo" 
                                                                        required/>
                                                                    <label for="correoWithTitle">Correo</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                            Cerrar
                                                        </button>
                                                        <button type="submit" class="btn btn-primary">Guardar cambios</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Basic Bootstrap Table -->
                            <div class="card">
                                <div class="table-responsive text-nowrap">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Nombres</th>
                                                <th>Apellidos</th>
                                                <th>DNI</th>
                                                <th>Opciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-border-bottom-0">
                                            <% for (Conductor conductor : conductors) {%>
                                            <tr id="conductor-<%= conductor.getId()%>">
                                                <td><span><%= conductor.getNombres()%></span></td>
                                                <td><%= conductor.getApellidos()%></td>
                                                <td><%= conductor.getNumero_documento()%></td>
                                                <td>
                                                    <div class="dropdown">
                                                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                            <i class="ri-more-2-line"></i>
                                                        </button>
                                                        <div class="dropdown-menu">
                                                            <button id="btnEditarConductor" class="dropdown-item" onclick="editarConductor(<%= conductor.getId()%>)"><i class="ri-pencil-line me-1"></i> Editar</button>
                                                            <button id="btnDeleteConductor" class="dropdown-item" onclick="eliminarConductor(<%= conductor.getId()%>)"><i class="ri-delete-bin-6-line me-1"></i> Eliminar</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <% }%>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!--/ Basic Bootstrap Table -->

                            <hr class="my-12" />
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
        <script>
            var token = "<%= session.getAttribute("token")%>";
            var conductorEditarId = null;

            async function registrarNuevoConductors() {
                const form = document.getElementById('nuevoConductorForm');
                conductorEditarId = null;

                for (let element of form.elements) {
                    element.value = '';
                }
                const modal = new bootstrap.Modal(document.getElementById('modalFormConductor'));
                modal.show();
            }

            async function guardarConductor(event) {
                event.preventDefault();

                const form = document.getElementById('nuevoConductorForm');
                const formData = new FormData(form);

                const conductorData = Object.fromEntries(formData);
                let accion = 'create';
                let method = 'POST';
                if (conductorEditarId > 0) {
                    accion = 'update';
                    method = 'PUT';
                    conductorData.id = conductorEditarId;
                } else {
                    delete conductorData.persona_id;
                }

                const response = await fetch('api/conductor/' + accion, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(conductorData)
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    location.reload();
                } else {
                    alert(result.message);
                }
            }
            async function editarConductor(id) {
                conductorEditarId = id;
                const response = await fetch('api/conductor/id/' + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    }
                });
                const result = await response.json();
                if (result.code === 200) {
                    const conductor = result.data;
                    const form = document.getElementById('nuevoConductorForm');

                    for (let element of form.elements) {
                        if (element.name && conductor.hasOwnProperty(element.name)) {
                            element.value = conductor[element.name] || '';
                        }
                    }
                    const modal = new bootstrap.Modal(document.getElementById('modalFormConductor'));
                    modal.show();
                } else {
                    alert(result.message);
                }


            }

            async function eliminarConductor(id) {
                if (confirm("¿Seguro que deseas eliminar este conductor?")) {

                    const response = await fetch('api/conductor/delete/id/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + token
                        }
                    });
                    const result = await response.json();
                    if (result.code === 200) {
                        var row = document.getElementById("conductor-" + id);
                        row.parentNode.removeChild(row);
                    } else {
                        alert(result.message);
                    }
                }
            }
        </script> 
    </body>
</html>

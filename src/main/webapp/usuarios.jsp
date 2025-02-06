<%@page import="org.json.JSONObject"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="shared.PaginationResult"%>
<%@page import="modules.usuario.services.impl.UsuarioServiceImpl"%>
<%@page import="modules.usuario.models.Usuario"%>

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
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        PaginationResult data = usuarioservice.paginate("", 1, 20);
        ArrayList<Usuario> usuarios = (ArrayList<Usuario>) data.getData();
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
                                <h5>Gestion de usuarios</h5>
                                <div class="float-end">
                                    <button class="btn btn-primary d-grid w-100" data-bs-toggle="modal"
                                            onclick="registrarNuevoUsuarios()">Nuevo</button>
                                    <div class="modal fade" id="modalFormUsuario" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered" role="document">
                                            <div class="modal-content">
                                                <form id="nuevoUsuarioForm" onsubmit="guardarUsuario(event)">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="modalFormUsuarioTitle">Nuevo usuario</h5>
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
                                                        <h6 class="mb-2 mt-2">Credenciales</h6>
                                                        <div class="row g-4">
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="text"
                                                                        id="nick"
                                                                        name="nick"
                                                                        class="form-control"
                                                                        placeholder="Ingresa el nick" 
                                                                        required/>
                                                                    <label for="nickWithTitle">Nick</label>
                                                                </div>
                                                            </div>
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <input
                                                                        type="password"
                                                                        id="clave"
                                                                        name="clave"
                                                                        class="form-control"
                                                                        placeholder="Ingresa la clave" 
                                                                        required/>
                                                                    <label for="claveWithTitle">Clave</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row g-4 mt-0">
                                                            <div class="col mb-2">
                                                                <div class="form-floating form-floating-outline">
                                                                    <select class="form-select" id="rol" aria-label="Rol de usuario" id="rol" name="rol" required>
                                                                        <option value="Administrador" selected="">Administrador</option>
                                                                        <option value="Operador">Operador</option>
                                                                        <option value="Auditor">Auditor</option>
                                                                    </select>
                                                                    <label for="exampleFormControlSelect1">Rol</label>
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
                                                <th>Rol</th>
                                                <th>Opciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-border-bottom-0">
                                            <% for (Usuario usuario : usuarios) {%>
                                            <tr id="usuario-<%= usuario.getId()%>">
                                                <td><span><%= usuario.getNombres()%></span></td>
                                                <td><%= usuario.getApellidos()%></td>
                                                <td><%= usuario.getNumero_documento()%></td>
                                                <td>
                                                    <span class="badge rounded-pill bg-label-primary me-1"><%= usuario.getRol()%></span>
                                                </td>
                                                <td>
                                                    <div class="dropdown">
                                                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                            <i class="ri-more-2-line"></i>
                                                        </button>
                                                        <div class="dropdown-menu">
                                                            <button id="btnEditarUsuario" class="dropdown-item" onclick="editarUsuario(<%= usuario.getId()%>)"><i class="ri-pencil-line me-1"></i> Editar</button>
                                                            <button id="btnDeleteUsuario" class="dropdown-item" onclick="eliminarUsuario(<%= usuario.getId()%>)"><i class="ri-delete-bin-6-line me-1"></i> Eliminar</button>
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
            var usuarioEditarId = null;

            async function registrarNuevoUsuarios() {
                const form = document.getElementById('nuevoUsuarioForm');
                usuarioEditarId = null;

                for (let element of form.elements) {
                    element.value = '';
                }
                const modal = new bootstrap.Modal(document.getElementById('modalFormUsuario'));
                modal.show();
            }

            async function guardarUsuario(event) {
                event.preventDefault();

                const form = document.getElementById('nuevoUsuarioForm');
                const formData = new FormData(form);

                const usuarioData = Object.fromEntries(formData);
                let accion = 'create';
                let method = 'POST';
                if (usuarioEditarId > 0) {
                    accion = 'update';
                    method = 'PUT';
                    usuarioData.id = usuarioEditarId;
                } else {
                    delete usuarioData.persona_id;
                }

                const response = await fetch('api/usuario/' + accion, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(usuarioData)
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    location.reload();
                } else {
                    alert(result.message);
                }
            }
            async function editarUsuario(id) {
                usuarioEditarId = id;
                const response = await fetch('api/usuario/id/' + id, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    }
                });
                const result = await response.json();
                if (result.code === 200) {
                    const usuario = result.data;
                    const form = document.getElementById('nuevoUsuarioForm');

                    for (let element of form.elements) {
                        if (element.name && usuario.hasOwnProperty(element.name)) {
                            element.value = usuario[element.name] || ''; // Asignamos el valor correspondiente o un valor vacío
                        }
                    }
                    const modal = new bootstrap.Modal(document.getElementById('modalFormUsuario'));
                    modal.show();
                } else {
                    alert(result.message);
                }


            }

            async function eliminarUsuario(id) {
                if (confirm("¿Seguro que deseas eliminar este usuario?")) {

                    const response = await fetch('api/usuario/delete/id/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + token
                        }
                    });
                    const result = await response.json();
                    if (result.code === 200) {
                        var row = document.getElementById("usuario-" + id);
                        row.parentNode.removeChild(row);
                    } else {
                        alert(result.message);
                    }
                }
            }
        </script> 
    </body>
</html>

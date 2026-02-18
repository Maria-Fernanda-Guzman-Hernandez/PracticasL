import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    deleteDoc, 
    doc 
} from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js';

function openTargetDetails() {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash); 
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function formatTimeAgo(ts) {
    if (!ts) return 'ahora mismo';
    let date;
    try {
        if (typeof ts.toDate === 'function') date = ts.toDate();
        else date = new Date(ts);
    } catch (e) { return 'ahora mismo'; }
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (isNaN(diffSec) || diffSec < 0 || diffSec < 60) return 'ahora mismo';
    if (diffSec < 3600) {
        const m = Math.floor(diffSec / 60);
        return m === 1 ? 'hace 1 minuto' : `hace ${m} minutos`;
    }
    if (diffSec < 86400) {
        const h = Math.floor(diffSec / 3600);
        return h === 1 ? 'hace 1 hora' : `hace ${h} horas`;
    }
    const days = Math.floor(diffSec / 86400);
    if (days < 30) return days === 1 ? 'hace 1 día' : `hace ${days} días`;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()}`;
}

function toggleComentarios(idSeccion) {
    const blog = document.getElementById('blog-' + idSeccion);
    if (blog) blog.style.display = (blog.style.display === 'block') ? 'none' : 'block';
}

function prepararRespuesta(idSeccion, nombrePersona, idComentario) {
    const inputParent = document.getElementById(`parent-${idSeccion}`);
    const indicador = document.getElementById(`reply-indicator-${idSeccion}`);
    const textarea = document.getElementById(`text-${idSeccion}`);
    if(inputParent) {
        inputParent.value = nombrePersona; 
        inputParent.dataset.parentId = idComentario;
    }
    if(indicador) {
        const nombreResp = indicador.querySelector('.nombre-resp');
        if(nombreResp) nombreResp.innerText = nombrePersona;
        indicador.style.display = 'flex';
    }
    if(textarea) textarea.focus();
}

function cancelarRespuesta(idSeccion) {
    const inputParent = document.getElementById(`parent-${idSeccion}`);
    const indicador = document.getElementById(`reply-indicator-${idSeccion}`);
    if(inputParent) {
        inputParent.value = '';
        inputParent.dataset.parentId = '';
    }
    if(indicador) indicador.style.display = 'none';
}

window.toggleComentarios = toggleComentarios;
window.prepararRespuesta = prepararRespuesta;
window.cancelarRespuesta = cancelarRespuesta;
window.enviarComentario = enviarComentario;
window.borrarComentario = borrarComentario;

    window.addEventListener('load', () => {
        const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];

        autocomplete({
            container: '.autocomplete-container',
            placeholder: ' Buscar...',
            openOnFocus: true,
            getSources({ query }) {
                return [
                    {
                        sourceId: 'faq',
                        getItems() {
                            return getAlgoliaResults({
                                searchClient: algoliasearch('A6QU2MP80T', '550d2e1ffd257e052f26912ea99c3114'),
                                queries: [{ indexName: 'algolia', query }],
                            });
                        },
                        templates: {
                            item({ item, html }) {
                                return html`
                                    <div class="suggestion-item">
                                        <div class="suggestion-title">${item.title}</div>
                                    </div>`;
                            },
                            noResults({ html }) {
                                return html`<div class="suggestion-item">No hay resultados</div>`;
                            }
                        },
                        onSelect({ item }) {
                            const element = document.getElementById(item.objectID);
                            if (element) {
                                if (element.tagName === 'DETAILS') element.open = true;
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }
                ];
            }
        });
    });
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            
            const searchInput = document.querySelector('.aa-Input');
            
            if (searchInput) {
                searchInput.focus();
            } else {
                const fallbackInput = document.querySelector('.autocomplete-container input');
                if (fallbackInput) fallbackInput.focus();
            }
        }
    });
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const spanClose = document.querySelector(".close");
    const zoomableImages = document.querySelectorAll('.zoomable-image, .zoomable-imageg, .img-cel');

    zoomableImages.forEach(img => {
        img.onclick = function() {
            if(modal && modalImg) {
                modal.style.display = "block";
                modalImg.src = this.src;
                modalImg.className = this.classList.contains('img-cel') ? "img-cel-modal" : "modal-content";
            }
        };
    });

    if (spanClose) spanClose.onclick = () => modal.style.display = "none";
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = "none"; });

    document.addEventListener('keydown', (e) => { 
        if (e.key === "Escape" && modal && modal.style.display === "block") {
            modal.style.display = "none"; 
        }
    });

const elementsToObserve = document.querySelectorAll('.Introcontrol h3, .Introcontrol h4'); 

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const activeLink = document.querySelector(`.faq-sidebar a[href="#${id}"]`);
            
            if (activeLink) {
                document.querySelectorAll('.faq-sidebar a').forEach(link => link.classList.remove('highlight'));
                activeLink.classList.add('highlight');
                const currentDetail = activeLink.closest('details');
                if (currentDetail) {
                    if (!currentDetail.open) currentDetail.setAttribute('open', '');
                    document.querySelectorAll('.faq-sidebar details').forEach(detail => {
                        if (detail !== currentDetail) {
                            detail.removeAttribute('open');
                        }
                    });
                }
            }
        }
    });
}, { rootMargin: '-10% 0px -70% 0px' }); 

elementsToObserve.forEach(el => sectionObserver.observe(el));

    const foros = document.querySelectorAll('.comentarios-dinamicos');
    foros.forEach(contenedor => {
        const id = contenedor.dataset.section;
        const titulo = contenedor.dataset.titulo;
        contenedor.innerHTML = `
            <div class="comentarios-toggle" onclick="toggleComentarios('${id}')">
                <span class="icon-bubble">💬</span> <span class="texto-toggle">Comentarios sobre ${titulo}</span>
            </div>
            <div id="blog-${id}" class="blog-desplegable" style="display:none;">
                <div class="contenedor-mensajes" id="mensajes-${id}"></div>
                <div class="comentarios-container">
                    <form onsubmit="enviarComentario(event, '${id}')" class="comen" id="form-${id}">
                        <input type="hidden" id="parent-${id}" value="" data-parent-id="">
                        <div id="reply-indicator-${id}" class="indicador-respuesta" style="display:none;">
                            <span>Respondiendo a <strong class="nombre-resp"></strong></span>
                            <button type="button" onclick="cancelarRespuesta('${id}')">×</button>
                        </div>
                        <div class="input-group">
                            <input type="text" id="user-${id}" placeholder="Tu nombre..." required>
                            <textarea id="text-${id}" placeholder="Escribe un comentario..." required></textarea>
                            <button type="submit" class="btn-enviar">Publicar</button>
                        </div>
                    </form>
                </div>
            </div>`;
        setupCommentsListener(id);
    });

    const footerForm = document.getElementById('footer-form');
    const mensajeExito = document.getElementById('mensaje-exito');
    const mensajeError = document.getElementById('mensaje-error'); 

    if (footerForm) {
        footerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nombre = footerForm.nombre.value.trim();
            const email = footerForm.email.value.trim();
            const comentario = footerForm.comentario.value.trim();

            if (!nombre || !email || !comentario) {
                alert("Por favor, llena todos los campos antes de enviar.");
                return; 
            }

            const formData = new FormData(footerForm);
            
            try {
                const response = await fetch(footerForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    footerForm.style.display = 'none';
                    if (mensajeExito) mensajeExito.style.display = 'block';
                    if (mensajeError) mensajeError.style.display = 'none'; 
                } else {
                    if (mensajeError) mensajeError.style.display = 'block';
                }
            } catch (err) { 
                console.error("Error footer:", err);
                if (mensajeError) mensajeError.style.display = 'block';
            }
        });
    }

    openTargetDetails();


async function enviarComentario(event, idSeccion) {
    if (event && event.preventDefault) event.preventDefault();
    const inputUsuario = document.getElementById(`user-${idSeccion}`);
    const inputTexto = document.getElementById(`text-${idSeccion}`);
    const inputParent = document.getElementById(`parent-${idSeccion}`);

    if (!inputTexto.value.trim()) return;

    try {
        await addDoc(collection(db, 'comentarios'), {
            nombre: inputUsuario.value || 'Anónimo',
            texto: inputTexto.value,
            seccion: idSeccion,
            parentId: inputParent.dataset.parentId || null,
            parentNombre: inputParent.value || null,
            createdAt: serverTimestamp()
        });
        cancelarRespuesta(idSeccion);
        document.getElementById(`form-${idSeccion}`).reset();
    } catch (err) { console.error('Error Firestore:', err); }
}

function setupCommentsListener(idSeccion) {
    const contenedor = document.getElementById(`mensajes-${idSeccion}`);
    if (!contenedor) return;

    const q = query(collection(db, 'comentarios'), where('seccion', '==', idSeccion), orderBy('createdAt', 'asc'));

    onSnapshot(q, (snapshot) => {
        contenedor.innerHTML = snapshot.empty ? '<p style="color:gray; font-size:12px;">Aún no hay comentarios.</p>' : '';
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const card = document.createElement('div');
            card.id = id;
            card.className = data.parentId ? 'comentario-card respuesta-hilo' : 'comentario-card';
            card.innerHTML = `
                <div class="user-info">
                    <strong>${data.nombre}</strong> 
                    ${data.parentId ? `<span class="respondiendo-a">➥ respondió a <b>${data.parentNombre}</b></span>` : ''}
                    <small>• ${formatTimeAgo(data.createdAt)}</small>
                </div>
                <p class="comentario-texto">${data.texto}</p>
                <div class="acciones-comentario">
                    <button type="button" class="btn-reply" onclick="prepararRespuesta('${idSeccion}', '${data.nombre}', '${id}')">Responder</button>
                    <button type="button" class="btn-delete" onclick="borrarComentario('${id}')">Eliminar</button>
                </div>`;
            
            if (data.parentId && document.getElementById(data.parentId)) {
                document.getElementById(data.parentId).after(card);
            } else {
                contenedor.appendChild(card);
            }
        });
    });
}

async function borrarComentario(idDoc) {
    if (confirm("¿Seguro qué quiere eliminar este comentario?")) {
        try { await deleteDoc(doc(db, 'comentarios', idDoc)); } 
        catch (err) { console.error("Error al borrar:", err); }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { 
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.faq-sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    document.querySelectorAll('.section-highlight').forEach(el => {
                        el.classList.remove('section-highlight');
                    });

                    targetElement.classList.add('section-highlight');

                    setTimeout(() => {
                        targetElement.classList.remove('section-highlight');
                    }, 2000);
                }
            }
        });
    });
});

sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const detailsParent = targetElement.closest('details');
                if (detailsParent) detailsParent.open = true;
                const headerOffset = 150;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});
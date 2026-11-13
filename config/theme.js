// Única preferência persistida: aparência. Aplicação síncrona antes da primeira pintura.
export const themeBootstrap = "(()=>{let t='light';try{if(localStorage.getItem('mutucoin-theme')==='dark')t='dark'}catch{}document.documentElement.dataset.theme=t})()";

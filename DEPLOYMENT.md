# 🚀 Guía de Despliegue en GitHub Pages

## Pasos para desplegar tu sitio web:

### 1. Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Nombre del repositorio: `victor-perez-portfolio` (o el nombre que prefieras)
5. Descripción: "Portfolio personal - Consultor en Automatización y Transformación Digital"
6. Selecciona **"Public"**
7. **NO** marques "Initialize this repository with a README" (ya tenemos uno)
8. Haz clic en **"Create repository"**

### 2. Conectar tu repositorio local con GitHub

Abre PowerShell en la carpeta del proyecto y ejecuta estos comandos:

```powershell
# Cambiar el nombre de la rama a main (si es necesario)
git branch -M main

# Agregar el repositorio remoto (reemplaza TU-USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/victor-perez-portfolio.git

# Subir los archivos a GitHub
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral, haz clic en **"Pages"**
4. En **"Source"**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Haz clic en **"Save"**
6. Espera unos minutos (GitHub te mostrará la URL donde estará disponible tu sitio)

### 4. Tu sitio estará disponible en:

```
https://TU-USUARIO.github.io/victor-perez-portfolio/
```

## 🔄 Actualizar el sitio

Cuando hagas cambios en el futuro:

```powershell
# Agregar todos los cambios
git add .

# Hacer commit con un mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir los cambios
git push
```

Los cambios se reflejarán en tu sitio en 1-2 minutos.

## ✅ Verificación

Una vez desplegado, verifica que:
- [ ] El sitio carga correctamente
- [ ] Todas las imágenes se ven bien
- [ ] El botón "Calcula tu ROI" funciona
- [ ] El chatbot interactivo responde
- [ ] La página es responsive en móvil

## 🎨 Personalización del dominio (Opcional)

Si quieres usar un dominio personalizado (ej: victorperezlamas.com):

1. Compra un dominio en un registrador (GoDaddy, Namecheap, etc.)
2. En GitHub Pages Settings, agrega tu dominio personalizado
3. Configura los DNS de tu dominio según las instrucciones de GitHub

## 📝 Notas importantes

- El repositorio debe ser **público** para usar GitHub Pages gratis
- Los cambios pueden tardar 1-2 minutos en reflejarse
- GitHub Pages es completamente gratuito para sitios estáticos
- El sitio se actualiza automáticamente cada vez que haces push

## 🆘 Solución de problemas

**Si el sitio no carga:**
- Verifica que GitHub Pages esté activado en Settings > Pages
- Asegúrate de que el archivo `index.html` esté en la raíz del repositorio
- Espera unos minutos, GitHub puede tardar en procesar los cambios

**Si las imágenes no se ven:**
- Verifica que las rutas de las imágenes sean relativas (sin `/` al inicio)
- Asegúrate de que los archivos de imagen estén en el repositorio

**Si el chatbot no funciona:**
- Abre la consola del navegador (F12) para ver errores
- Verifica que `script.js` se esté cargando correctamente

---

¡Listo! Tu sitio web profesional estará en línea y accesible para todo el mundo. 🎉

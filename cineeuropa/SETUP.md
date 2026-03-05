# CINEEUROPA — Guía de instalación

## Paso 1: Crear el repositorio en GitHub

1. Andá a **github.com/new**
2. Nombre del repositorio: `cineeuropa`
3. Dejalo como **Public**
4. **NO** marques "Add a README" (ya tenemos los archivos)
5. Click en **Create repository**

## Paso 2: Subir los archivos desde tu computadora

Abrí la Terminal (en Mac: buscar "Terminal" en Spotlight) y ejecutá estos comandos uno por uno:

```bash
cd ~/Documents/cineeuropa
```

(o la carpeta donde tengas los archivos de CINEEUROPA)

```bash
git init
git add index.html data.json scraper.py requirements.txt .gitignore .github/
git commit -m "CINEEUROPA — primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cineeuropa.git
git push -u origin main
```

**Reemplazá `TU_USUARIO` con tu nombre de usuario de GitHub.**

## Paso 3: Activar GitHub Pages (poner el sitio online)

1. En tu repositorio, andá a **Settings** (pestaña arriba a la derecha)
2. En el menú lateral, buscá **Pages**
3. En "Source" elegí: **Deploy from a branch**
4. En "Branch" elegí: **main** y carpeta **/ (root)**
5. Click en **Save**

Tu sitio estará online en unos minutos en:
**https://TU_USUARIO.github.io/cineeuropa/**

## Paso 4: Verificar que la actualización automática funciona

1. En tu repositorio, andá a la pestaña **Actions**
2. Vas a ver el workflow "Actualizar noticias CINEEUROPA"
3. Podés hacer click en **Run workflow** para probarlo manualmente
4. Si funciona, va a correr automáticamente 3 veces al día (8am, 1pm, 8pm hora Argentina)

## Paso 5 (opcional): Dominio personalizado

Si querés usar un dominio como `cineeuropa.com.ar`:

1. Comprá el dominio (ej: en NIC Argentina o Namecheap)
2. En **Settings > Pages**, escribí tu dominio en "Custom domain"
3. Configurá estos registros DNS en tu proveedor:
   - Tipo A: `185.199.108.153`
   - Tipo A: `185.199.109.153`
   - Tipo A: `185.199.110.153`
   - Tipo A: `185.199.111.153`
   - Tipo CNAME: `TU_USUARIO.github.io`

---

## Estructura de archivos

```
cineeuropa/
├── index.html          ← El sitio web
├── data.json           ← Datos (se actualiza automáticamente)
├── scraper.py          ← Script que scrapea las 7 fuentes
├── requirements.txt    ← Dependencias de Python
├── .gitignore
└── .github/
    └── workflows/
        └── scrape.yml  ← Configuración de actualización automática
```

## ¿Cómo funciona la actualización?

1. GitHub Actions ejecuta `scraper.py` 3 veces al día
2. El script lee las 7 fuentes de noticias (RSS + HTML)
3. Filtra solo contenido de cine europeo
4. Genera un nuevo `data.json` con las noticias frescas
5. Lo commitea al repositorio automáticamente
6. GitHub Pages lo publica — tu sitio se actualiza solo

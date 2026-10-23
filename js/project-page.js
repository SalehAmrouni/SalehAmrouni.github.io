import { loadProject, renderDetail, wireDetail } from './projects.js';
import { startPhysics } from './physics.js';

startPhysics(document.getElementById('physics-canvas'), { autoSpawn: 0.9 });

async function showProject() {
  const container = document.getElementById('project-details');
  const titleEl = document.getElementById('page-title');
  const id = new URLSearchParams(window.location.search).get('p');

  if (!id) {
    container.innerHTML = '<p class="error-text">No project specified. <a href="index.html">Back to the desktop</a>.</p>';
    return;
  }

  try {
    const project = await loadProject(id);
    titleEl.textContent = `C:\\PORTFOLIO\\${id.toUpperCase()}.EXE`;
    document.title = `${project.title} // Saleh Amrouni`;
    container.innerHTML = renderDetail(project);
    wireDetail(container, project);
  } catch (err) {
    console.error(err);
    titleEl.textContent = 'C:\\PORTFOLIO\\ERROR.LOG';
    container.innerHTML = `<p class="error-text">File not found: ${id.replace(/[^a-z0-9_-]/gi, '').toUpperCase()}.EXE. <a href="index.html">Back to the desktop</a>.</p>`;
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}

showProject();

// Motivos animados (SVG) para cada especialidade — minimalistas, contextuais e
// leves. Traço em verde sálvia com um detalhe dourado. Animação suave via CSS.
export default function EspecialidadeMotif({ variant }) {
  return (
    <span className={`esp-motif esp-${variant}`} aria-hidden="true">
      {MOTIFS[variant] || MOTIFS.camadas}
    </span>
  );
}

const S = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

const MOTIFS = {
  // Emagrecimento → composição corporal equilibrando-se
  equilibrio: (
    <svg viewBox="0 0 100 100">
      <line x1="20" y1="70" x2="80" y2="70" className="ln" strokeWidth="2.5" {...S} />
      <line x1="50" y1="70" x2="50" y2="52" className="ln" strokeWidth="2.5" {...S} />
      <g className="seesaw">
        <line x1="26" y1="40" x2="74" y2="40" className="ln" strokeWidth="2.5" {...S} />
        <circle cx="26" cy="40" r="8" className="ln" strokeWidth="2.5" {...S} />
        <circle cx="74" cy="40" r="6" className="au" strokeWidth="2.5" {...S} />
      </g>
    </svg>
  ),
  // Endócrino/metabólico → camadas internas se organizando (anéis concêntricos)
  organizar: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="10" className="au r1" strokeWidth="2.5" {...S} />
      <circle cx="50" cy="50" r="20" className="ln r2" strokeWidth="2.5" {...S} />
      <circle cx="50" cy="50" r="30" className="ln r3" strokeWidth="2.2" {...S} />
    </svg>
  ),
  // SOP → ciclo hormonal (pontos em órbita sincronizada)
  ciclo: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="26" className="ln" strokeWidth="2" strokeDasharray="4 6" {...S} />
      <circle cx="50" cy="50" r="5" className="au" strokeWidth="2.5" {...S} />
      <g className="orbit">
        <circle cx="50" cy="24" r="4.5" className="ln fillsage" strokeWidth="0" />
      </g>
      <g className="orbit orbit2">
        <circle cx="50" cy="76" r="3.5" className="au fillgold" strokeWidth="0" />
      </g>
    </svg>
  ),
  // TPM / equilíbrio hormonal → duas ondas sincronizadas
  sincronia: (
    <svg viewBox="0 0 100 100">
      <clipPath id="cw">
        <rect x="12" y="20" width="76" height="60" />
      </clipPath>
      <g clipPath="url(#cw)">
        <path className="wave ln" d="M-40 42 q 20 -12 40 0 t 40 0 t 40 0 t 40 0" strokeWidth="2.5" {...S} />
        <path className="wave wave2 au" d="M-40 60 q 20 -12 40 0 t 40 0 t 40 0 t 40 0" strokeWidth="2.5" {...S} />
      </g>
    </svg>
  ),
  // Performance / hipertrofia → fibras musculares estilizadas
  fibras: (
    <svg viewBox="0 0 100 100">
      <g className="fibras-g">
        <path className="ln" d="M32 22 q 6 28 0 56" strokeWidth="2.5" {...S} />
        <path className="ln" d="M44 20 q 7 30 0 60" strokeWidth="2.5" {...S} />
        <path className="au" d="M56 20 q 7 30 0 60" strokeWidth="2.5" {...S} />
        <path className="ln" d="M68 22 q 6 28 0 56" strokeWidth="2.5" {...S} />
      </g>
    </svg>
  ),
  // Nutrição clínica funcional → camadas se organizando
  camadas: (
    <svg viewBox="0 0 100 100">
      <g className="camadas-g">
        <line x1="28" y1="36" x2="72" y2="36" className="ln c1" strokeWidth="3" {...S} />
        <line x1="24" y1="50" x2="76" y2="50" className="au c2" strokeWidth="3" {...S} />
        <line x1="30" y1="64" x2="70" y2="64" className="ln c3" strokeWidth="3" {...S} />
      </g>
    </svg>
  ),
};

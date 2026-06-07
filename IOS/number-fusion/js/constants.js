// Tile visual styles — keyed by tile value.
// Each entry defines the gradient background and text color.
export const TILE_STYLES = {
  2:    { bg: 'linear-gradient(135deg,#EDE7F6,#CE93D8)', c: '#4A148C', glow: null },
  4:    { bg: 'linear-gradient(135deg,#CE93D8,#AB47BC)', c: '#fff',    glow: null },
  8:    { bg: 'linear-gradient(135deg,#AB47BC,#7B1FA2)', c: '#fff',    glow: null },
  16:   { bg: 'linear-gradient(135deg,#E57373,#C62828)', c: '#fff',    glow: null },
  32:   { bg: 'linear-gradient(135deg,#FF8A65,#E64A19)', c: '#fff',    glow: null },
  64:   { bg: 'linear-gradient(135deg,#FFB74D,#F57C00)', c: '#fff',    glow: null },
  128:  { bg: 'linear-gradient(135deg,#81C784,#2E7D32)', c: '#fff',    glow: null },
  256:  { bg: 'linear-gradient(135deg,#4FC3F7,#0277BD)', c: '#fff',    glow: null },
  512:  { bg: 'linear-gradient(135deg,#4DD0E1,#006064)', c: '#fff',    glow: '0 0 16px rgba(77,208,225,.6)' },
  1024: { bg: 'linear-gradient(135deg,#F06292,#880E4F)', c: '#fff',    glow: '0 0 20px rgba(240,98,146,.7)' },
  2048: { bg: 'linear-gradient(135deg,#FFD700,#FF6F00)', c: '#fff',    glow: '0 0 28px rgba(255,215,0,.9),0 0 50px rgba(255,165,0,.5)' },
};

export const TILE_STYLE_DEFAULT = { bg: 'linear-gradient(135deg,#EF5350,#B71C1C)', c: '#fff', glow: null };

export const GRID = 4;
export const GAP  = 10; // px, must match CSS --gap
export const PAD  = 10; // px, must match CSS --pad

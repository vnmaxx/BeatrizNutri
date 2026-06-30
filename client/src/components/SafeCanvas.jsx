import { Component } from "react";

// Error boundary: se a cena 3D falhar (WebGL, GPU, etc.), degrada para o
// fallback em vez de quebrar a página.
export default class SafeCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn("[3d] cena desativada:", err?.message);
  }
  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}

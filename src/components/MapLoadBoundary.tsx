import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { unavailable: boolean };

export class MapLoadBoundary extends Component<Props, State> {
  state: State = { unavailable: false };

  static getDerivedStateFromError(): State {
    return { unavailable: true };
  }

  render() {
    if (this.state.unavailable) {
      return <div className="absolute inset-0" role="region" aria-label="Interactive blossom location map">
        <p className="absolute left-1/2 top-1/2 max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-paper p-4 text-center text-sm font-semibold shadow-lg" role="alert">The map is temporarily unavailable. Use List view to browse every reviewed location.</p>
      </div>;
    }
    return this.props.children;
  }
}

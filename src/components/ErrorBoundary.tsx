import React from 'react';
type FallBackRender = (props: { error: Error | null }) => React.ReactElement
export class ErrorBoundary
  extends React.Component<React.PropsWithChildren<{ fallBackRender: FallBackRender }>, { error: Error | null }>{
  // state: Readonly<{ error: Error | null; }>;
  state = { error: null }
  //当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render(): React.ReactNode {
    const { error } = this.state
    const { fallBackRender, children } = this.props
    if (error) {
      return fallBackRender({ error })
    }
    return children
  }
}

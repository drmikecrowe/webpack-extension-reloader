import { Compiler } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";

  constructor(private _compiler: Compiler) {
  }

  public afterOptimizeChunkAssets(call) {
    return this._compiler.hooks.compilation.tap(
          CompilerEventsFacade.extensionName,
          comp =>
            comp.hooks.afterOptimizeChunkAssets.tap(
              CompilerEventsFacade.extensionName,
              chunks => call(comp, chunks),
            ),
        );
  }

  public afterEmit(call) {
    return this._compiler.hooks.afterEmit.tap(
          CompilerEventsFacade.extensionName,
          call);
  }
}

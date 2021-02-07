import { assert } from "chai";
import { spy, stub } from "sinon";
import * as webpack from "webpack";
import ExtensionReloaderImpl from "../src/ExtensionReloader";
import { IExtensionReloaderInstance } from "../typings/webpack-extension-reloader";

describe("ExtensionReloader", () => {
  const envCopy = { ...process.env };

  const registerStub = stub(
    ExtensionReloaderImpl.prototype,
    "_registerPlugin",
  ).returns();
  const versionCheckSpy = spy(ExtensionReloaderImpl.prototype._isWebpackGToEV4);

  function pluginFactory(): IExtensionReloaderInstance {
    return new ExtensionReloaderImpl();
  }

  beforeEach(() => {
    registerStub.reset();
    versionCheckSpy.resetHistory();
    process.env = { ...envCopy };
  });

  describe("When applying plugin, should check if is in development mode", () => {
    it("Should check for --mode flag on versions >= 4", () => {
      const plugin = pluginFactory();
      const mockedCompiler = { options: {} } as webpack.Compiler;

      plugin.apply(mockedCompiler);
      assert(registerStub.notCalled);

      mockedCompiler.options.mode = "development";
      plugin.apply(mockedCompiler);
      assert(registerStub.calledOnce);
    });

    it("Should check for NODE_ENV variable on versions < 4", () => {
      delete process.env.NODE_ENV;
      const plugin = pluginFactory();
      const mockedCompiler = { options: {} } as webpack.Compiler;
      plugin.apply(mockedCompiler);

      assert(registerStub.notCalled);

      process.env.NODE_ENV = "development";

      plugin.apply(mockedCompiler);
      assert(registerStub.notCalled);
    });
  });
});

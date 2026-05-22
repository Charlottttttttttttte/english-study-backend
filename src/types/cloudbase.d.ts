declare module '@cloudbase/js-sdk' {
  interface CloudbaseApp {
    database(): any;
    auth(): any;
    uploadFile(options: { cloudPath: string; filePath: any }): Promise<{ fileID: string }>;
    getTempFileURL(options: { fileList: string[] }): Promise<any>;
  }

  function init(options: { env: string }): CloudbaseApp;

  export default { init };
}

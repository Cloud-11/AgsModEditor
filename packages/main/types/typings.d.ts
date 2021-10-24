interface IpcRoute {
  name: string;
  callback(event: any, data: {}): any;
}
interface PageCommand {
  method: string;
  args: string | any;
}

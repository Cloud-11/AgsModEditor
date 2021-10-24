interface tabPaneData {
  index: string;
  key: string;
  title: string;
  type: string;
}
interface sendMessage {
  active: string;
  data: { method: string; args: { path: string; data?: any } };
}

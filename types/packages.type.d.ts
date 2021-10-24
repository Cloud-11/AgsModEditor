interface Msg {
  status: number;
  msg?: string;
  data?: ModPackageInfoData;
}
interface ModPackageInfo {
  id: string;
  publishedId: string;
  netId: string;
  version: number;
  displayName: string;
  description: string;
  isTrackingPlaytime: boolean;
  completionProgressPercent: number;
  screenshotLastWriteTimeTicksHashs?: number[];
  publishedTags?: string[];
  visibility: number;
}
interface ModPackageInfoData {
  packageInfo: ModPackageInfo;
  icon: { src: string };
  path: string;
}

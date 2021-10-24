interface defaultDataType {
  id: string;
  displayName: string;
}
interface idIndex {
  [key as string]: string;
}
interface cardSet extends defaultDataType {
  id: string;
  displayName: string;
  displayNameInCardLibrary: string;
  availableForCharacterId: string;
  section: string;
  tagCode: string;
  cardIds: string[];
}
interface characterSet extends defaultDataType {
  id: string;
  displayName: string;
  displayNameInCardLibrary: string;
  availableForCharacterId: string;
  section: string;
  spawnPointTag: string;
  tagCode: string;
  characterIds: string[];
}
interface level extends defaultDataType {
  id: string;
  displayName: string;
  availableForCharacterId: string;
  section: string;
  passageStageCount: number;
  branchStageCount: number;
  notAllowRandomizeStages: boolean;
  mapId: string;
  stageSize: string;
}

interface sound extends defaultDataType {
  id: string;
  assetId: string;
  displayName: string;
}
interface music extends defaultDataType {
  id: string;
  assetId: string;
  displayName: string;
  testFilePath: string;
}
interface grade extends defaultDataType {
  id: string;
  requiredExp: string;
  unlockCardCount: string;
  unlockCharacterCount: string;
}

interface effect extends defaultDataType {
  id: string;
  assetId: string;
  displayName: string;
  comment: string;
  soundId: string;
  fieldCode: string;
  code: string;
  projectileEmitCode: string;
  projectileBodyEffectId: string;
  projectileDieCode: string;
  projectileSpeed: string;
}
interface card extends defaultDataType {
  id: string;
  displayName: string;
  characterModelSkinId: string;
  price: string;
  energyReq: string;
  range: string;
  spreadRadius: string;
  spreadShapeTextureId: string;
  aimTypeCode: string;
  perferredTargetTypeCode: string;
  tagCode: string;
  description: string;
  code: string;
  remapCode: string;
  backgroundId: string;
  effectCode: string;
}
interface character extends defaultDataType {
  id: string;
  displayName: string;
  modelId: string;
  modelSkinId: string;
  description: string;
  comment: string;
  minimapModelId: string;
  story: string;
  minUnlockGrade: string;
  tagCode: string;
  fieldCode: string;
  energy: string;
  stamina: string;
  moveSpeed: string;
  initialHandCardCount: string;
  startTurnDrawHandCardCount: string;
  hp: string;
  selfCardTagCode: string;
  selfCardCode: string;
  interactionPlotId: string;
  dropFilterCode: string;
  initialRunCardIds: string[];
  cardIds: string[];
}
interface cardCommand extends defaultDataType {
  id: string;
  description: string;
  quoteDescription: string;
  effectCode: string;
  remapCode: string;
  comment: string;
}
interface stage extends defaultDataType {
  id: string;
  displayName: string;
  // comment: string;
  availableForCharacterId: string;
  section: string;
  envModelId: string;
  mapId: string;
  minimapModelId: string;
  tagCode: string;
  randomWeight: string;
  fieldCode: string;
  size: string;
  characterCountCode: string;
  initialCodePlotId: string;
  rewardGetterCode0: string;
  rewardGetterCode1: string;
  portTeleporterCharacterId: string;
  rewardMoney: string;
  rewardExp: string;
  musicId: string;
  safeMusicId: string;
}

export const cards = {
  state: () => {
    return {
      data: {
        id: {
          id: "",
          displayName: "",
          characterModelSkinId: "",
          price: "",
          energyReq: "",
          range: "",
          spreadRadius: "",
          spreadShapeTextureId: "",
          aimTypeCode: "",
          perferredTargetTypeCode: "",
          tagCode: "",
          description: "",
          code: "",
          remapCode: "",
          backgroundId: "",
          effectCode: "",
        },
      },
      idIndex: {},
      tagType: {},
    };
  },
};
export const character = {
  state: () => [
    {
      id: "",
      displayName: "",
      modelId: "",
      modelSkinId: "",
      description: "",
      comment: "",
      minimapModelId: "",
      tagCode: "",
      fieldCode: "",
      energy: "",
      stamina: "",
      moveSpeed: "",
      initialHandCardCount: "",
      startTurnDrawHandCardCount: "",
      hp: "",
      selfCardTagCode: "",
      selfCardCode: "",
      interactionPlotId: "",
      dropFilterCode: "",
      initialRunCardIds: [""],
      cardIds: [""],
    },
  ],
};
export const cardCommand = {
  state: () => [
    {
      id: "",
      description: "",
      quoteDescription: "",
      effectCode: "",
      remapCode: "",
      comment: "",
    },
  ],
};
export const stage = {
  state: () => [
    {
      id: "",
      displayName: "",
      comment: "",
      availableForCharacterId: "",
      section: "",
      envModelId: "",
      mapId: "",
      minimapModelId: "",
      tagCode: "",
      randomWeight: "",
      fieldCode: "",
      size: "",
      characterCountCode: "",
      characterCount_TgtPos: "",
      characterCount_Box: "",
      initialCodePlotId: "",
      rewardGetterCode0: "",
      rewardGetterCode1: "",
      portTeleporterCharacterId: "",
      rewardMoney: "",
      rewardExp: "",
      musicId: "",
      safeMusicId: "",
    },
  ],
};
export const cardSet = {
  state: () => [
    {
      id: "",
      displayName: "",
      displayNameInCardLibrary: "",
      availableForCharacterId: "",
      section: "",
      tagCode: "",
      comment: "",
      cardIds: [""],
    },
  ],
};
export const characterSet = {
  state: () => [
    {
      id: "",
      displayName: "",
      internalName: "",
      availableForCharacterId: "",
      section: "",
      spawnPointTag: "",
      tagCode: "",
      comment: "",
      characterIds: [""],
    },
  ],
};
export const level = {
  state: () => [
    {
      id: "",
      displayName: "",
      availableForCharacterId: "",
      section: "",
      passageStageCount: 0,
      branchStageCount: 0,
      notAllowRandomizeStages: false,
      mapId: "",
      stageSize: "",
    },
  ],
};
export const sound = {
  state: () => [{ id: "", assetId: "", displayName: "" }],
};
export const music = {
  state: () => [{ id: "", assetId: "", displayName: "", testFilePath: "" }],
};
export const grade = {
  state: () => [
    {
      id: "",
      requiredExp: "",
      unlockCardCount: "",
      unlockCharacterCount: "",
    },
  ],
};
export const effect = {
  state: () => [
    {
      id: "",
      assetId: "",
      displayName: "",
      comment: "",
      soundId: "",
      fieldCode: "",
      code: "",
      projectileEmitCode: "",
      projectileBodyEffectId: "",
      projectileDieCode: "",
      projectileSpeed: "",
    },
  ],
};

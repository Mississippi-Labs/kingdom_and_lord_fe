export function createSystemCalls(
  { client },
) {
  const { actions } = client;

  const spawn = async ({ account }) => {
    try {
      return await actions.spawn({ account });
    } catch (error) {
      console.error("Error executing spawn:", error);
      throw error;
    }
  }

  const startUpgrade = async ({ account, id, data, proof }) => {
    try {
      return await actions.startUpgrade({ account, id, data, proof });
    } catch (error) {
      console.error("Error executing spawn:", error);
      throw error;
    }
  }

  const finishUpgrade = async ({ account, id }) => {
    try {
      return await actions.finishUpgrade({ account, id });
    } catch (error) {
      console.error("Error executing finishUpgrade:", error);
      throw error;
    }
  }

  const getBuildingsLevels = async (player) => {
    try {
      return await actions.getBuildingsLevels(player);
    } catch (error) {
      console.error("Error executing getBuildingsLevels:", error);
      throw error;
    }
  }

  const getUnderUpgrading = async (player) => {
    try {
      return await actions.getUnderUpgrading(player);
    } catch (error) {
      console.error("Error executing getUnderUpgrading:", error);
      throw error;
    }
  }

  const getGrowthRate = async (player) => {
    try {
      return await actions.getGrowthRate(player);
    } catch (error) {
      console.error("Error executing getGrowthRate:", error);
      throw error;
    }
  }

  const getResource = async (player) => {
    try {
      return await actions.getResource(player);
    } catch (error) {
      console.error("Error executing getGrowthRate:", error);
      throw error;
    }
  }

  const getUpgradeInfo = async (id, player) => {
    try {
      return await actions.getUpgradeInfo(id, player);
    } catch (error) {
      console.error("Error executing getUpgradeInfo:", error);
      throw error;
    }
  }

  const getCompleteUpgrading = async (player) => {
    try {
      return await actions.getCompleteUpgrading(player);
    } catch (error) {
      console.error("Error executing getCompleteUpgrading:", error);
      throw error;
    }
  }

  return {
    spawn,
    startUpgrade,
    getBuildingsLevels,
    getUnderUpgrading,
    getGrowthRate,
    getUpgradeInfo,
    finishUpgrade,
    getResource,
    getCompleteUpgrading
  };
}

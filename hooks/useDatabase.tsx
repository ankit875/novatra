import { generateClient } from "aws-amplify/data";
import FirecrawlApp from "@mendable/firecrawl-js";
import type { Schema } from "../amplify/data/resource";
import { configureAmplify } from "@/lib/amplify";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || "";

const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// Create client lazily to ensure Amplify is configured
let client: ReturnType<typeof generateClient<Schema>> | null = null;

const getClient = () => {
  if (!client) {
    configureAmplify();
    client = generateClient<Schema>({ authMode: "apiKey" });
  }
  return client;
};

const useDatabase = () => {
  const getProfile = async (userId: string) => {
    const amplifyClient = getClient();
    console.log(
      "Fetching profile for userId:",
      await amplifyClient.models.User.list()
    );
    // Use manual filtering for reliability
    const allUsers = await amplifyClient.models.User.list();
    const user = {
      data: allUsers.data.filter(u => u.username === userId)
    };

    if (user.data.length === 0) {
      const newUser = {
        username: userId,
      };
      await amplifyClient.models.User.create({
        ...newUser,
      });
      return newUser;
    } else {
      return user.data[0];
    }
  };

  const getMarketData = async (marketId: number) => {
    try {
      // Use manual filtering since GraphQL filters don't work reliably
      const allMarkets = await getClient().models.Market.list();
      
      // Filter manually for the matching onchainId
      const matchingMarket = allMarkets.data.find(market => {
        return market.onchainId === marketId;
      });
      
      return matchingMarket || undefined;
    } catch (error) {
      console.error('❌ Error in getMarketData:', error);
      throw error;
    }
  };

  const getMyPositions = async (userId: string, marketId: string) => {
    // Use manual filtering for reliability
    const allPositions = await getClient().models.Position.list();
    const filteredPositions = allPositions.data.filter(position => 
      position.userId === userId && position.marketId === marketId
    );
    return filteredPositions;
  };

  const getRecentPositions = async () => {
    const positions = await getClient().models.Position.list({
      limit: 10,
    });
    return positions.data.map((item) => {
      return {
        ...item,
        activity: "bet",
      };
    });
  };

  const getRecentOutcomes = async () => {
    const outcomes = await getClient().models.Outcome.list({
      limit: 10,
    });
    return outcomes.data.map((item) => {
      return {
        ...item,
        activity: "outcome",
      };
    });
  };

  const getMarkets = async (chainId: string) => {
    return [];
  };

  const getMarketsByCreator = async (creatorId: string) => {
    return [];
  };

  const getResources = async () => {
    const resources = await getClient().models.Resource.list();
    return resources.data;
  };

  const getOutcomeById = async (outcomeId: number) => {
    // Use manual filtering for reliability
    const allOutcomes = await getClient().models.Outcome.list();
    const matchingOutcome = allOutcomes.data.find(outcome => 
      outcome.onchainId === outcomeId
    );
    return matchingOutcome || undefined;
  };

  const getOutcomes = async (marketId: string, roundId: number) => {
    const market = await getClient().models.Market.get({
      id: marketId,
    });

    if (!market.data) {
      throw new Error("Market not found");
    }

    const rounds = await market.data.rounds();
    const thisRound: any = rounds.data.find(
      (item: any) => item.onchainId === Number(roundId)
    );

    if (!thisRound) {
      return [];
    } else {
      const outcomes = await thisRound.outcomes();
      return outcomes.data;
    }
  };

  const getAllOutcomes = async () => {
    const markets = await getClient().models.Market.list();

    let output: any = [];

    for (const market of markets.data) {
      const rounds = await market.rounds();
      for (const round of rounds.data) {
        const outcomes = await round.outcomes();
        output.push(...outcomes.data);
      }
    }

    output = output.filter((item: any) => !item.result);

    if (output.length <= 8) return output;
    return output.sort(() => 0.5 - Math.random()).slice(0, 8);
  };

  const addOutcome = async ({
    marketId,
    roundId,
    title,
    resolutionDate,
  }: any) => {
    // create new round if not exist
    const market = await getClient().models.Market.get({
      id: marketId,
    });

    if (!market.data) {
      throw new Error("Market not found");
    }

    let rounds = await market.data.rounds();
    let thisRound: any = rounds.data.find(
      (item: any) => item.onchainId === Number(roundId)
    );

    if (!thisRound) {
      await getClient().models.Round.create({
        marketId,
        onchainId: Number(roundId),
      });
      rounds = await market.data.rounds();
      thisRound = rounds.data.find(
        (item: any) => item.onchainId === Number(roundId)
      );
    }

    const outcomes = await getClient().models.Outcome.list();

    const maxOutcomeId = outcomes.data.reduce((result: number, item: any) => {
      if (item.onchainId > result) {
        result = item.onchainId;
      }
      return result;
    }, 0);

    const onchainId = maxOutcomeId + 1;

    await getClient().models.Outcome.create({
      roundId: thisRound.id,
      onchainId,
      title,
      resolutionDate: Math.floor(new Date(resolutionDate).valueOf() / 1000),
    });
  };

  const updateOutcomeWeight = async ({ marketId, roundId, weights }: any) => {
    const market = await getClient().models.Market.get({
      id: marketId,
    });

    if (!market.data) {
      throw new Error("Market not found");
    }

    const rounds = await market.data.rounds();
    const thisRound: any = rounds.data.find(
      (item: any) => item.onchainId === Number(roundId)
    );

    const outcomes = await thisRound.outcomes();

    for (const outcome of outcomes.data) {
      const currentOutcome = weights.find(
        (item: any) => item.outcomeId === outcome.onchainId
      );
      const weight = currentOutcome.outcomeWeight;

      console.log("updating..", outcome.id, weight);

      await getClient().models.Outcome.update({
        id: outcome.id,
        weight,
      });
    }

    const lastWeightUpdatedAt = Math.floor(new Date().valueOf() / 1000);

    await getClient().models.Round.update({
      id: thisRound.id,
      lastWeightUpdatedAt,
    });
  };

  const addPosition = async ({
    marketId,
    userId,
    roundId,
    outcomeId,
    amount,
    walletAddress,
  }: any) => {
    const positions = await getClient().models.Position.list();

    const maxPositionId = positions.data.reduce((result: number, item: any) => {
      if (item.onchainId > result) {
        result = item.onchainId;
      }
      return result;
    }, 0);

    const onchainId = maxPositionId + 1;

    await getClient().models.Position.create({
      marketId,
      userId,
      roundId,
      onchainId,
      predictedOutcome: outcomeId,
      betAmount: amount,
      walletAddress,
    });
  };

  const updatePosition = async (positionId: any) => {
    await getClient().models.Position.update({
      id: positionId,
      isClaimed: true,
    });
  };

  const increaseOutcomeBetAmount = async ({
    marketId,
    roundId,
    outcomeId,
    amount,
  }: any) => {
    const market = await getClient().models.Market.get({
      id: marketId,
    });

    if (!market.data) {
      throw new Error("Market not found");
    }

    const rounds = await market.data.rounds();
    const thisRound: any = rounds.data.find(
      (item: any) => item.onchainId === Number(roundId)
    );

    const outcomes = await thisRound.outcomes();

    const outcome = outcomes.data.find(
      (item: any) => item.onchainId === outcomeId
    );

    await getClient().models.Outcome.update({
      id: outcome.id,
      totalBetAmount: outcome.totalBetAmount + amount,
    });

    await getClient().models.Market.update({
      id: marketId,
      betPoolAmount: market.data.betPoolAmount + amount,
    });
  };

  const crawl = async (resource: any) => {
    let need_update = false;

    if (resource.lastCrawledAt === undefined) {
      need_update = true;
    } else if (new Date().valueOf() / 1000 - resource.lastCrawledAt > 86400) {
      need_update = true;
    }

    if (need_update) {
      const result: any = await app.scrapeUrl(resource.url, {
        formats: ["markdown", "html"],
      });

      await getClient().models.Resource.update({
        id: resource.id,
        lastCrawledAt: Math.floor(new Date().valueOf() / 1000),
        crawledData: result.markdown,
      });

      return result.markdown;
    } else {
      return resource.crawledData;
    }
  };

  const getRecentActivities = async () => {
    const positions = await getRecentPositions();
    const outcomes = await getRecentOutcomes();

    const combinedArray = [...positions, ...outcomes];

    // Sort by createdTime in descending order (newest first)
    const sortedArray = combinedArray.sort((a: any, b: any) => {
      // Converting to Date objects in case createdTime is a string
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      return timeB - timeA; // Descending order
    });

    return sortedArray.slice(0, 10);
  };

  return {
    crawl,
    getProfile,
    getMarkets,
    getResources,
    getMarketsByCreator,
    addOutcome,
    getOutcomes,
    getMarketData,
    addPosition,
    increaseOutcomeBetAmount,
    getMyPositions,
    updateOutcomeWeight,
    getAllOutcomes,
    getOutcomeById,
    updatePosition,
    getRecentOutcomes,
    getRecentPositions,
    getRecentActivities,
    // finalizeWeights
  };
};

export default useDatabase;

import { useState, useEffect, useCallback } from "react";
import { statistics } from "../api/statistics";
import { authFetch } from "../api/client";
import type {
  BirdStatisticsDTO,
  UserLogStatisticsDTO,
  FamilyStatisticsDTO,
  RegionCountDTO,
  BirdCountDTO,
} from "../types/statsTypes";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  Bird,
  Binoculars,
  MapPin,
  Users,
  BarChart3,
  Award,
  Eye,
} from "lucide-react";

interface BirdWithImageDTO extends BirdCountDTO {
  imageUrl?: string;
}

export default function StatisticsPage() {
  const [birdStats, setBirdStats] = useState<BirdStatisticsDTO | null>(null);
  const [userStats, setUserStats] = useState<UserLogStatisticsDTO | null>(null);
  const [familyStats, setFamilyStats] = useState<FamilyStatisticsDTO | null>(
    null
  );
  const [regionStats, setRegionStats] = useState<RegionCountDTO[]>([]);
  const [topBirds, setTopBirds] = useState<BirdWithImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTopBirds, setLoadingTopBirds] = useState(true);

  // Function to fetch bird image by ID
  const fetchBirdImage = useCallback(
    async (birdId: number): Promise<string | undefined> => {
      try {
        const response = await authFetch(`/api/birds/${birdId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch bird: ${response.status}`);
        }

        const birdDetails = await response.json();
        return birdDetails.imageUrl;
      } catch (error) {
        console.error(`Failed to fetch image for bird ${birdId}:`, error);
        return undefined;
      }
    },
    []
  );

  // Function to enhance birds with images
  const enhanceBirdsWithImages = useCallback(
    async (birds: BirdCountDTO[]): Promise<BirdWithImageDTO[]> => {
      const enhancedBirds = await Promise.all(
        birds.map(async (bird) => {
          const imageUrl = await fetchBirdImage(bird.birdId);
          return {
            ...bird,
            imageUrl,
          };
        })
      );
      return enhancedBirds;
    },
    [fetchBirdImage]
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all stats including user logs which contains mostSpottedBirds
        const [birdData, userData, familyData, regionData] = await Promise.all([
          statistics.getBirdStatistics(),
          statistics.getUserLogStatistics(), // This contains mostSpottedBirds
          statistics.getFamilyStats(5),
          statistics.getRegionStatistics(),
        ]);

        setBirdStats(birdData);
        setUserStats(userData);
        setFamilyStats(familyData);
        setRegionStats(regionData);

        // Use the mostSpottedBirds from userData instead of calling top-birds API
        if (userData?.mostSpottedBirds?.length > 0) {
          const enhancedTopBirds = await enhanceBirdsWithImages(
            userData.mostSpottedBirds.slice(0, 5)
          );
          setTopBirds(enhancedTopBirds);
        } else {
          setTopBirds([]);
        }
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Failed to load statistics. Please try again.");
      } finally {
        setLoading(false);
        setLoadingTopBirds(false);
      }
    };

    fetchStats();
  }, [enhanceBirdsWithImages]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-rose-800 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple text-white px-4 py-2 rounded-md hover:bg-purple/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-center sm:text-start text-3xl tracking-wider font-logo text-purple mx-4 mb-6">
          Statistics
        </h1>

        {/* Most Spotted Birds Frame with Images */}
        <div className="mb-8">
          <div className="bg-lilac/30 rounded-lg p-6 shadow-md border border-purple/20">
            <h2 className="text-xl font-sans font-bold text-purple mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-sage" />
              Most Spotted Species
            </h2>

            {loadingTopBirds ? (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto"></div>
                <p className="mt-2 text-purple/70 text-sm">
                  Loading top birds...
                </p>
              </div>
            ) : topBirds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topBirds.map((bird, index) => (
                  <div
                    key={bird.birdId}
                    className="bg-white/50 rounded-lg p-4 text-center"
                  >
                    {/* Bird Image */}
                    <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                      {bird.imageUrl ? (
                        <img
                          src={bird.imageUrl}
                          alt={bird.birdName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            // Show rank number if image fails
                            const rankElement = document.createElement("span");
                            rankElement.className =
                              "text-xl font-bold text-sage";
                            rankElement.textContent = (index + 1).toString();
                            target.parentElement?.appendChild(rankElement);
                          }}
                        />
                      ) : (
                        <span className="text-xl font-bold text-sage">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-purple text-sm mb-1 line-clamp-2">
                      {bird.birdName}
                    </h3>

                    <p className="text-xs text-purple/70 mb-2">
                      {bird.observationCount}{" "}
                      {bird.observationCount === 1 ? "sighting" : "sightings"}
                    </p>

                    <button
                      onClick={() =>
                        (window.location.href = `/birds/${bird.birdId}`)
                      }
                      className="bg-sage text-offwhite px-2 py-1 rounded-md hover:bg-sage/80 transition-colors text-xs flex items-center mx-auto"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-purple/70">
                No bird spotting data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-serif">
            {/* Total Species Card */}
            <div className="bg-lilac/30 rounded-lg p-4 text-center">
              <Bird className="w-8 h-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold text-purple">Total Species</h3>
              <p className="text-2xl font-bold text-sage">
                {birdStats?.totalSpecies || 0}
              </p>
            </div>

            {/* Total Observations Card */}
            <div className="bg-lilac/30 rounded-lg p-4 text-center">
              <Binoculars className="w-8 h-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold text-purple">Total Spottings</h3>
              <p className="text-2xl font-bold text-sage">
                {birdStats?.totalObservations || 0}
              </p>
            </div>

            {/* Total Families Card */}
            <div className="bg-lilac/30 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold text-purple">Bird Families</h3>
              <p className="text-2xl font-bold text-sage">
                {birdStats?.totalFamilies || 0}
              </p>
            </div>

            {/* Regions Visited Card */}
            <div className="bg-lilac/30 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 text-purple mx-auto mb-2" />
              <h3 className="font-semibold text-purple">Regions Visited</h3>
              <p className="text-2xl font-bold text-sage">
                {userStats?.totalRegionsVisited || 0}
              </p>
            </div>
          </div>

          {/* Top Regions */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-purple mb-6 flex items-center text-xl">
              <MapPin className="w-5 h-5 mr-3" />
              Top Regions by Spottings
            </h3>
            <div className="flex justify-between gap-4">
              {regionStats.slice(0, 3).map((region) => (
                <div
                  key={region.regionName}
                  className="flex-1 text-center rounded-lg p-5 hover:bg-lilac/20 transition-colors  min-w-0"
                >
                  <h4 className="font-semibold text-purple text-sm mb-3 leading-tight">
                    {region.regionName}
                  </h4>
                  <p className="text-2xl font-bold text-sage mb-1">
                    {region.observationCount}
                  </p>
                  <p className="text-xs text-purple/60 font-medium">
                    sightings
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* User Statistics */}
          {userStats && (
            <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple mb-4 flex items-center text-xl">
                <BarChart3 className="w-5 h-5 mr-2" />
                Log Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="text-purple/70">Logs Saved</h4>
                  <p className="text-xl font-bold text-sage">
                    {userStats.totalLogs}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-purple/70">Species Spotted</h4>
                  <p className="text-xl font-bold text-sage">
                    {userStats.totalSpeciesObserved}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-purple/70">Regions Visited</h4>
                  <p className="text-xl font-bold text-sage">
                    {userStats.totalRegionsVisited}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Families with Most Species */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple mb-4 flex items-center text-xl">
                <Bird className="w-5 h-5 mr-2" />
                Families with Most Species
              </h3>
              <div className="space-y-2">
                {familyStats?.familiesWithMostSpecies
                  ?.slice(0, 5)
                  .map((family, index) => (
                    <div
                      key={family.familyId}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-purple">
                        {index + 1}. {family.familyName}
                      </span>
                      <span className="bg-purple text-offwhite px-2 py-1 rounded text-xs">
                        {family.birdCount} species
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Families with Most Observations */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple text-xl mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Families with Most Observations
              </h3>
              <div className="space-y-2">
                {familyStats?.familiesWithMostObservations
                  ?.slice(0, 5)
                  .map((family, index) => (
                    <div
                      key={family.familyId}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-purple">
                        {index + 1}. {family.familyName}
                      </span>
                      <span className="bg-sage text-offwhite px-2 py-1 rounded text-xs">
                        {family.observationCount} spottings
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

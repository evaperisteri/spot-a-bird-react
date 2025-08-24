import { useState, useEffect } from "react";
import { statistics } from "../api/statistics";
import type {
  BirdStatisticsDTO,
  UserLogStatisticsDTO,
  FamilyStatisticsDTO,
  RegionCountDTO,
} from "../types/statsTypes";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Bird, Binoculars, MapPin, Users, BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  const [birdStats, setBirdStats] = useState<BirdStatisticsDTO | null>(null);
  const [userStats, setUserStats] = useState<UserLogStatisticsDTO | null>(null);
  const [familyStats, setFamilyStats] = useState<FamilyStatisticsDTO | null>(
    null
  );
  const [regionStats, setRegionStats] = useState<RegionCountDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [birdData, userData, familyData, regionData] = await Promise.all([
          statistics.getBirdStatistics(),
          statistics.getUserLogStatistics(),
          statistics.getFamilyStats(5),
          statistics.getRegionStatistics(),
        ]);

        setBirdStats(birdData);
        setUserStats(userData);
        setFamilyStats(familyData);
        setRegionStats(regionData);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Failed to load statistics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-logo text-purple mb-6">Statistics</h1>
        <div className="bg-offwhite/80 rounded-lg shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-logo">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Regions */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Top Regions by Spottings
              </h3>
              <div className="space-y-2">
                {regionStats.slice(0, 5).map((region, index) => (
                  <div
                    key={region.regionName}
                    className="flex justify-between items-center"
                  >
                    <span className="text-purple">
                      {index + 1}. {region.regionName}
                    </span>
                    <span className="bg-sage text-offwhite px-2 py-1 rounded text-sm">
                      {region.observationCount} spottings
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Birds */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple mb-4 flex items-center">
                <Binoculars className="w-5 h-5 mr-2" />
                Most Spotted Birds
              </h3>
              <div className="space-y-2">
                {userStats?.mostSpottedBirds?.slice(0, 5).map((bird, index) => (
                  <div
                    key={bird.birdId}
                    className="flex justify-between items-center"
                  >
                    <span className="text-purple">
                      {index + 1}. {bird.birdName}
                    </span>
                    <span className="bg-sage text-offwhite px-2 py-1 rounded text-sm">
                      {bird.observationCount} sightings
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Statistics */}
          {userStats && (
            <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-purple mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                My Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="text-purple/70">My Logs</h4>
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
              <h3 className="font-semibold text-purple mb-4 flex items-center">
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
              <h3 className="font-semibold text-purple mb-4 flex items-center">
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";

type BirdwatchingLog = {
  id: number;
  userFullName: string;
  speciesName: string;
  regionName: string;
};

export default function TableDashboard() {
  const [logs, setLogs] = useState<BirdwatchingLog[]>([]);
  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        const res = await fetch(
          "/api/bwlogs/paginated?page=0&size=10&sortBy=observationDate&sortDirection=DESC"
        );
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data.content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllLogs();
  }, []);

  return (
    <>
      <table className="w-full border-collapse">
        <thead className="bg-purple/10">
          <tr className="border-b-2 border-purple/30">
            <th className="p-3 text-left font-sans font-semibold text-purple">
              User
            </th>
            <th className="p-3 text-left font-sans font-semibold text-purple">
              Species
            </th>
            <th className="p-3 text-left font-sans font-semibold text-purple">
              Location
            </th>
            <th className="p-3 text-center font-sans font-semibold text-purple">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm md:text-lg">
          {logs.map((log) => (
            <tr className="border-b border-purple/10 hover:bg-lilac/20 transition-colors">
              <td className="p-3 font-sans text-purple">{log.userFullName}</td>
              <td className="p-3 font-sans text-purple">{log.speciesName}</td>
              <td className="p-3 font-sans text-purple">{log.regionName}</td>
              <td className="p-3 flex justify-center space-x-4">
                <Link to="./birdwatching-log.html">
                  <Eye className="w-5 h-5 text-purple/70 hover:text-purple transition-colors" />
                </Link>
                <Link to="./edit-log.html">
                  <Pencil className=" w-5 h-5 text-purple/70 hover:text-sage transition-colors" />
                </Link>
                <Link to="./edit-log.html" className="">
                  <Trash className="w-5 h-5 text-purple/70 hover:text-red-400 transition-colors" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

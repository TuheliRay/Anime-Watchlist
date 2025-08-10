import  { useContext, Fragment , useRef } from "react";
import AnimeContext from "./AnimeContext";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function PersonalLists({ref}) {
  const { personalList, removeAnimeFromList } = useContext(AnimeContext);

  const renderList = (list, status) => {
    if (!list || list.length === 0) {
      return <p className="text-gray-500 m-4">No anime in this list yet.</p>;
    }
    return (
      <div className="flex flex-col gap-3" ref={ref}>
        {list.map((anime) => (
          <div
            key={anime.mal_id || anime.id}
            className="bg-[#2b3245] p-4 rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <h4 className="font-bold text-white">{anime.title}</h4>
              {anime.genre && (
                <p className="text-sm text-gray-400">{anime.genre}</p>
              )}
            </div>

            {/* 3-dot menu */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="p-1 rounded-full hover:bg-gray-600">
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-[#1f2937] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => removeAnimeFromList(status, anime.mal_id || anime.id)}
                        className={`${
                          active ? "bg-red-600 text-white" : "text-red-400"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#0f1624] min-h-screen p-6 text-gray-300">
      <h2 className="text-4xl font-extrabold m-12 text-center bg-gradient-to-r from-purple-700 via-pink-400 to-red-400 bg-clip-text text-transparent">
        Your Personal Lists
      </h2>

      <div className="space-y-6 max-w-7xl mx-auto text-center">
        <div className="bg-[#162031] rounded-2xl w-full p-6 ">
          <h3 className="text-green-400 font-semibold text-lg mb-3">
            Watching <span className="font-bold">({personalList.Watching.length})</span>
          </h3>
          {renderList(personalList.Watching, "Watching")}
        </div>

        <div className="bg-[#162031] rounded-2xl w-full p-6">
          <h3 className="text-blue-500 font-semibold text-lg mb-3">
            Completed <span className="font-bold">({personalList.Completed.length})</span>
          </h3>
          {renderList(personalList.Completed, "Completed")}
        </div>

        <div className="bg-[#162031] rounded-2xl w-full p-6">
          <h3 className="text-yellow-400 font-semibold text-lg mb-3">
            Plan to Watch <span className="font-bold">({personalList["Plan to Watch"].length})</span>
          </h3>
          {renderList(personalList["Plan to Watch"], "Plan to Watch")}
        </div>
      </div>
    </div>
  );
}

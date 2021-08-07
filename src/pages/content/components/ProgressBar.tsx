import { atom, useAtom } from "jotai";
import { useBgMessage } from "../hook";
import { MESSAGE_ACTIONS } from "@src/constants";

const progressState = atom({
  current: 0,
  total: 0,
});

export default function ProgressBar() {
  const [{ current, total }, setState] = useAtom(progressState);

  useBgMessage({
    [MESSAGE_ACTIONS.PROGRESS]: (request, sender, _) => {
      console.log("[useBgMessage][Type: Progress][Component: ProgressBar]", request.data);
      setState({
        current: request.data.current,
        total: request.data.total,
      });
    },
  });

  return (
    <div className="animate-dynamic-h-container" data-open={current !== total}>
      <div className="animate-dynamic-h-content">
        <div className="flex flex-col gap-3 px-4 py-4 mb-4 rounded-lg bg-muted">
          <div className="flex justify-between text-sm">
            <div className="">Downloading conversations...</div>
            <div className="">
              <span>{`${current}/${total}`}</span>
              <span className="inline-block ml-2">
                {Math.round((current / total) * 100) + "%"}
              </span>
            </div>
          </div>

          <div className="mb-1 h-[3px] w-full relative">
            <div
              className="absolute inset-y-0 left-0 z-10 bg-green-600"
              style={{
                right: `${100 - (current / total) * 100}%`,
                transition: "all 0.2s ease-in-out",
              }}
            ></div>
            <div className="absolute inset-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

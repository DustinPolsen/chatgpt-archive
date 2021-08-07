import { Spinner } from "@src/components/Spinner";
import React from "react";

export function Loading() {
  return (
    <div className="my-12 flex items-center justify-center">
      <Spinner />
    </div>
  );
}


import { Progress } from "@heroui/react";
function Loader() {

  return (

    <div className={`flex bg-background dark:bg-secondary_dark duration-200 ease-linear items-center justify-center`}>
      <div>
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="max-w-xs"
          classNames={{
            indicator: "!bg-primary dark:!bg-primary_dark",
          }}
        />
      </div>
    </div>
  );
}

export default Loader;

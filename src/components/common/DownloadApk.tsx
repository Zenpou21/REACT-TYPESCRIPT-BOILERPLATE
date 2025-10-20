import { Button } from "@heroui/react";
import { Download } from "lucide-react";
import React from "react";
const DownloadAPK: React.FC = () => {
  return (
    <div>
      <a href="/TSX Boilerplate v1.1.0.apk" download>
        <Button
          className="w-full text-sm"
          variant="bordered"
          startContent={<Download size={17} />}
        >
          Download APK
        </Button>
      </a>
    </div>
  );
};

export default DownloadAPK;

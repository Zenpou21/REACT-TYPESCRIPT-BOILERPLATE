import { Button, Pagination } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface CustomPaginationProps {
  data: any;
  pages: number;
  page: number;
  setPage: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  data,
  pages,
  page,
  setPage,
}) => {
  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  return (
    <div className="py-2 px-2 xl:flex justify-between items-center">
      <div className="basis-2/12 text-center xl:text-start mb-4 xl:mb-0">
        <span className="text-default-400  dark:text-default-600 text-xs">
          Total of {data?.length || 0} {data?.length > 1 ? `Entries` : `Entry`}
        </span>
      </div>
      <div className="flex basis-10/12 justify-center xl:justify-end gap-2 items-center">
        <Button
          disableAnimation
          className="rounded-md"
          isDisabled={pages === 1}
          size="sm"
          isIconOnly
          variant="flat"
          onPress={onPreviousPage}
        >
          <ChevronLeft size={17} />
        </Button>
        <Pagination
          className="!bg-none"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <Button
          disableAnimation
          className="rounded-md"
          isIconOnly
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          <ChevronRight size={17} />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;

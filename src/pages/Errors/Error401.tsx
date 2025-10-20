export default function Error401() {
  return (
    <div className="flex items-center justify-center h-[75vh]">
      <div className="flex flex-col gap-y-4 md:flex-row gap-x-10">
        <div className=" flex flex-col justify-center items-center">
          <div className="font-bold text-9xl">401</div>
          <div className="font-bold text-2xl">Forbidden</div>
        </div>
        <div className="text-default-600">
          <div className="text-md">
            Oops! Looks like you don't have permission to view this page.
          </div>
          <div className="font-semibold mt-5">Here’s what you can do:</div>
          <ul className="mb-5 list-disc ml-5">
            <li>Double-check the URL for any typos.</li>
            <li>Return to the home page and try navigating from there.</li>
            <li>
              If you still can’t access the page, contact support for
              assistance.
            </li>
          </ul>
          <div>Thank you for your patience!</div>
        </div>
      </div>
    </div>
  );
}

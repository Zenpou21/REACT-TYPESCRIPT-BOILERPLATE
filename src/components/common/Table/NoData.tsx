import no_rows_to_display from "../../../assets/icons/no_rows_to_display.svg"
export default function NoData(){
    return (
        <div className="flex flex-col items-center justify-center">
        <img src={no_rows_to_display} alt="No Rows To Display" />
        <div className="text-sm mt-2">No data to display</div>
        </div>
    )
}
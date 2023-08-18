"use client"

async function onSearch(e) {
    if (e.target.value.length > 3) {
        const query = e.target.value
        const res = await fetch(process.env.NEXT_PUBLIC_MEMORYMAPPER_ENDPOINT + 'features/attachments/documents/?search=' + query + '&limit=5', {cache: 'no-store'})
        const data = await res.json()
        console.log(data)
    }
}

export default function Search() {

    

    return (
        <div className="flex flex-col">
      <div className="h-full">
          <input
            type="search"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-slate-500 sm:text-sm sm:leading-6"
            placeholder="Search..."
            onChange={onSearch}
          />
      </div>
      </div>
    )
  }
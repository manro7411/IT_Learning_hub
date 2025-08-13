import AdminsistratorBar from "./Widgets/AdministratorBar"

const Sdashboard = () => {
    return(
        <div className="flex h-screen bg-gray-50">
      <AdminsistratorBar/>

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex justify-end mb-6">
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white shadow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Name’s Submitted</h2>
                <a href="#" className="text-blue-600 text-sm">See All</a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left relative">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b">
                      <th className="py-2 px-4">NAME & DATE</th>
                      <th className="py-2 px-4">COURSE TYPE</th>
                      <th className="py-2 px-4">COURSE TITLE</th>
                      <th className="py-2 px-4">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-2">
            <div className="space-y-6 mt-4 xl:mt-0">
  
            </div>
          </div>
        </div>
      </main>
    </div>
    )
}
export default Sdashboard
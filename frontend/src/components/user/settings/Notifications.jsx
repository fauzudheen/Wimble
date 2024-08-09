import Buttons from "../misc/Buttons";

const Notifications = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage how you receive notifications.</p>
          <div className="mt-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900 dark:text-white">By App</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      Follows
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Get notified when someone follows you.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      Likes
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Get notified when someone likes your articles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      Comments
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Get notified when someone comments on your articles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      Meetings
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Get notified when you have an upcoming meeting.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      System
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">Get notified regarding system events.</p>
                  </div>
                </div>
                {/* Add more notification options here */}
              </div>
            </fieldset>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <button type="button" className={Buttons.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={`ml-3 ${Buttons.tealBlueGradientButton}`}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Notifications;
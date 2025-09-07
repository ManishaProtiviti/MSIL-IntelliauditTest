import { checkHandlers } from "../../api/enterprise/constants.js";
import { handleFolderSetup } from "../../utils/folder-setup.js.js";
import db from '../../configs/db/index.js'
export async function uploadRequestConsumer(data) {
  try {
    let jsondata;
    try {
      jsondata = JSON.parse(data);
    } catch (er) {
      throw new Error("uploadRequestConsumer:: json parse failed", err);
    }
    const checksJsonColl = await handleFolderSetup(jsondata.requestId);
    console.log(checksJsonColl)
    // handle python script processing on data.
    const promises = [];
    const selectedChecks = Object.keys(jsondata.checks).filter(
      (key) => jsondata.checks[key] === true
    );
    selectedChecks.forEach((key) =>
      promises.push(() =>
        checkHandlers[key](jsondata.requestId, checksJsonColl)
      )
    );
    await Promise.all(promises.map(fn => fn()));
    await db.query(
      `UPDATE transaction_status set status = $1 where session_id = $2`,
      ['completed', jsondata.requestId]
    );
    // TODO: send email

  } catch (e) {
    console.log(
      "uploadRequestConsumer:: error handling message from queue",
      data
    );
    console.log(e);
  }
}

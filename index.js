import { logger } from "./src/application/logging.js";
import { web } from "./src/application/web.js";

web.listen(300, () => {
    logger.info('App Started');
})
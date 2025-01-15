import { logger } from "./src/application/logging.js";
import { web } from "./src/application/web.js";

web.listen(3000, '0.0.0.0', () => {
    logger.info('App Started');
})
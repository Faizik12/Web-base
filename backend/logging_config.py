import logging
import sys


def configure_logging():
    log_format = ('%(asctime)s | %(levelname)-8s | '
                  '%(name)s.%(funcName)s | %(message)s')
    log_level = logging.INFO

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(log_format))

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

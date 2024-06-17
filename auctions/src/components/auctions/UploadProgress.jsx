import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const UploadProgress = ({ progress }) => {
    return (
        <motion.div
        style={{ height: '5px', background: 'black' }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        />
    );
};

export default UploadProgress;
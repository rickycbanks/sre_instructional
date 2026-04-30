'use client';

import React, { useState } from 'react';

const cloudServices = [
  { category: 'Compute', aws: 'EC2', azure: 'Virtual Machines', gcp: 'Compute Engine' },
  { category: 'Containers', aws: 'EKS', azure: 'AKS', gcp: 'GKE' },
  { category: 'Serverless', aws: 'Lambda', azure: 'Functions', gcp: 'Cloud Functions' },
  { category: 'Storage', aws: 'S3', azure: 'Blob Storage', gcp: 'Cloud Storage' },
  { category: 'Database', aws: 'RDS', azure: 'SQL Database', gcp: 'Cloud SQL' },
  { category: 'NoSQL', aws: 'DynamoDB', azure: 'Cosmos DB', gcp: 'Bigtable' },
  { category: 'Networking', aws: 'VPC', azure: 'VNet', gcp: 'VPC' },
  { category: 'IAM', aws: 'IAM', azure: 'Azure AD', gcp: 'Cloud IAM' },
];

export default function CloudReferenceCard() {
  const [activeCloud, setActiveCloud] = useState<'aws' | 'azure' | 'gcp'>('aws');

  return (
    <div className="my-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm not-prose bg-white dark:bg-zinc-950">
      <div className="flex bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        {(['aws', 'azure', 'gcp'] as const).map((cloud) => (
          <button
            key={cloud}
            onClick={() => setActiveCloud(cloud)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeCloud === cloud 
                ? 'bg-white dark:bg-zinc-950 text-blue-600 border-b-2 border-blue-600' 
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {cloud.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {cloudServices.map((service) => (
            <div key={service.category} className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-medium text-zinc-500 uppercase">{service.category}</span>
              <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-50">
                {service[activeCloud]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 italic">
        Select a cloud provider to see its service mapping.
      </div>
    </div>
  );
}

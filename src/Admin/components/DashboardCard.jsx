import React from 'react'

export default function DashboardCard(props) {
    return (
        <div className={`w-64 h-32 cursor-pointer bg-${props.color}-500 hover:bg-${props.color}-600 rounded-md shadow-md flex items-center flex-col gap-2 justify-center`}>
            <h1 className="text-white text-3xl">{props.title}</h1>
            <h2 className="text-4xl font-bold text-white">
                {props.value}
            </h2>
        </div>
    )
}

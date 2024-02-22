import React, { Component } from 'react'
import { Navbar} from "flowbite-react"
import {
Link
} from "react-router-dom"


export default class NavbarComp extends Component{
    render(){
        return(
                <div className="navbar">
                        <Navbar fluid rounded>
                        <Navbar.Brand>
                            <span className="self-center whitespace-nowrap text-2xl font-bold dark:text-white">Resimen Kadet</span>
                        </Navbar.Brand>
                        </Navbar>
                </div>
        )
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./pages/Login"));
const Register_1 = __importDefault(require("./pages/Register"));
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/login"/>}/>
        <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
        <react_router_dom_1.Route path="/dashboard" element={<Dashboard_1.default />}/>
        <react_router_dom_1.Route path="/register" element={<Register_1.default />}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;

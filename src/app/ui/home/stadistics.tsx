import CustomBarChart from "./custom-bar-chart";
import CustomDoughnutChart from "./custom-doughnut-chart";

const products = [
    {
        "ID": 1,
        "Producto": "Producto 1",
        "Categoría": "Categoría 1",
        "Fecha": "2023-12-15",
        "Cantidad": 10
    },
    {
        "ID": 2,
        "Producto": "Producto 2",
        "Categoría": "Categoría 2",
        "Fecha": "2023-12-16",
        "Cantidad": 15
    },
    {
        "ID": 3,
        "Producto": "Producto 3",
        "Categoría": "Categoría 1",
        "Fecha": "2023-12-17",
        "Cantidad": 20
    },
    {
        "ID": 4,
        "Producto": "Producto 4",
        "Categoría": "Categoría 3",
        "Fecha": "2023-12-18",
        "Cantidad": 12
    },
    {
        "ID": 5,
        "Producto": "Producto 5",
        "Categoría": "Categoría 2",
        "Fecha": "2023-12-19",
        "Cantidad": 8
    }
]

export default function Statistics() {
    return (
        <div className="grid h-3/4  mr-10 gap-5 grid-cols-statistics-layout grid-rows-statistics-layout">
            <CustomBarChart />
            <CustomDoughnutChart/>
            <div className="bg-tertiary px-8 py-6 rounded-lg overflow-auto">
                <h4>Lorem Ipsum</h4>
                <div className="grid grid-cols-table grid-rows-4 pt-2 min-w-[800px]">
                    <h4 className="text-base text-center">ID</h4>
                    <h4 className="text-base text-center">Producto</h4>
                    <h4 className="text-base text-center">Categoría</h4>
                    <h4 className="text-base text-center">Fecha</h4>
                    <h4 className="text-base text-center">Cantidad</h4>
                    {products.map((product) => {
                        return (<>
                            <h6 className="text-gray-200 text-sm text-center">{product.ID}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Producto}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Categoría}</h6>
                            <h6 className="text-gray-200 text-sm  text-center">{product.Fecha}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Cantidad}</h6>
                        </>);
                    }
                    )
                    }
                </div>
            </div>
            <div className="bg-tertiary px-8 py-6 rounded-lg overflow-auto">
                <h4>Lorem Ipsum</h4>
                <div className="grid grid-cols-table grid-rows-4 pt-2 min-w-[500px]">
                    <h4 className="text-base text-center">ID</h4>
                    <h4 className="text-base text-center">Producto</h4>
                    <h4 className="text-base text-center">Categoría</h4>
                    <h4 className="text-base text-center">Fecha</h4>
                    <h4 className="text-base text-center">Cantidad</h4>
                    {products.map((product) => {
                        return (<>
                            <h6 className="text-gray-200 text-sm text-center">{product.ID}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Producto}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Categoría}</h6>
                            <h6 className="text-gray-200 text-sm  text-center">{product.Fecha}</h6>
                            <h6 className="text-gray-200 text-sm text-center">{product.Cantidad}</h6>
                        </>);
                    }
                    )
                    }
                </div>
            </div>
        </div>
    )
}

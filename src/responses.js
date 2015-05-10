var responses = {
    error : function(req,res,next,code,msg){
        res.send({
            code : code,
            message : msg
        });
        next();
    },
    success : function(req,res,next,code,data){
        res.send({
            code : code,
            data : data
        });
        next();
    },
    random : function(req,res,next){
        var min = req.params.min || false;
        var max = req.params.max || false;
        var decimales = req.params.decimales || false;
        if(!min || !max || isNaN(min) || isNaN(max) || (decimales && isNaN(decimales)) || (max == min)) return responses.error(req,res,next,400,'Los parámetros mínimo y máximo son obligatorios y han de ser numéricos y distintos');


        function roundWDecimals(n, decimals) {
            if (!isNaN(parseFloat(n)) && isFinite(n)) {
                if (typeof(decimals) == typeof(undefined)) {
                    decimals = 0;
                }
                var decimalPower = Math.pow(10, decimals);
                return Math.round(parseFloat(n) * decimalPower) / decimalPower;
            }
            return NaN;
        }

        min=parseFloat(min); max=parseFloat(max);
        if(max<min){
            var aux=min;
            min=max;
            max=aux;
        }
        var value=(Math.random() * (max - min)) + min;
        if(decimales) value = roundWDecimals(value,decimales);
        return responses.success(req,res,next,200,value);
    }
};

module.exports = responses;
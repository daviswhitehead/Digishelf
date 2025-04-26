describe('testHusky', () => {
    it('should concatenate parameters',   ()=>{
        const result = testHusky("hello",    " world");
        expect(result).toBe("hello world")
    })
}) 